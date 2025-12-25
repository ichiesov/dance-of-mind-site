import { TokenStorage } from './token-storage';
import { AuthenticationError } from './auth-error';
import { emitAuthError } from '@/hooks/use-auth-error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AuthSessionResponse {
  session_id: string;
  expires_in: number;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
}

export interface ProgressResponse {
  solved_cards: string[];
}

export class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<void> | null = null;
  private readonly canSkipAuth: string[] = [
    '/api/auth/init',
    '/api/auth/tokens',
    '/api/auth/refresh',
  ];

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private shouldSkipAuth(url: string): boolean {
    return this.canSkipAuth.some((path) => url.includes(path));
  }

  private async ensureValidToken(): Promise<string | null> {
    // Если токен валидный, возвращаем его
    if (TokenStorage.hasValidAccessToken()) {
      const accessToken = TokenStorage.getAccessToken();
      return accessToken?.token || null;
    }

    // Если уже идет процесс обновления, ждем его завершения
    if (this.refreshPromise) {
      await this.refreshPromise;
      const accessToken = TokenStorage.getAccessToken();
      return accessToken?.token || null;
    }

    // Проверяем, есть ли валидный refresh токен
    if (TokenStorage.isRefreshTokenExpired()) {
      TokenStorage.clearTokens();
      emitAuthError();
      throw new AuthenticationError('Refresh token expired');
    }

    // Запускаем процесс обновления токена
    this.refreshPromise = this.performTokenRefresh();

    try {
      await this.refreshPromise;
      const accessToken = TokenStorage.getAccessToken();
      return accessToken?.token || null;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    const refreshToken = TokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken.token,
      }),
    });

    if (!response.ok) {
      TokenStorage.clearTokens();
      emitAuthError();
      throw new AuthenticationError('Failed to refresh token');
    }

    const data: RefreshTokenResponse = await response.json();
    TokenStorage.saveTokens(
      data.access_token,
      data.access_expires_in,
      data.refresh_token,
      data.refresh_expires_in
    );
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    // Если URL в белом списке, делаем запрос без авторизации
    if (this.shouldSkipAuth(url)) {
      return fetch(url, options);
    }

    // Получаем валидный токен (с автоматическим обновлением если нужно)
    const token = await this.ensureValidToken();

    if (!token) {
      emitAuthError();
      throw new AuthenticationError('No valid token available');
    }

    // Добавляем токен в заголовки
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async initAuth(phoneNumber: string): Promise<AuthSessionResponse> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/auth/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize authentication');
    }

    return response.json();
  }

  async getTokens(sessionId: string): Promise<TokenPair> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/auth/tokens/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get tokens');
    }

    return response.json();
  }

  async refreshTokens(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh tokens');
    }

    return response.json();
  }

  async getProgress(): Promise<ProgressResponse> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get progress');
    }

    return response.json();
  }

  async saveProgress(cardId: string): Promise<void> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/progress/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quest_id: cardId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save progress');
    }
  }
}

export const apiClient = new ApiClient();
