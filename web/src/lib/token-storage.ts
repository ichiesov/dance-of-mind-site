export interface StoredToken {
  token: string;
  expires_at: number;
}

export interface StoredTokenPair {
  access: StoredToken;
  refresh: StoredToken;
}

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export class TokenStorage {
  static saveTokens(
    accessToken: string,
    accessExpiresIn: number,
    refreshToken: string,
    refreshExpiresIn: number
  ): void {
    if (typeof window === 'undefined') return;

    const accessData: StoredToken = {
      token: accessToken,
      expires_at: Date.now() + accessExpiresIn * 1000,
    };

    const refreshData: StoredToken = {
      token: refreshToken,
      expires_at: Date.now() + refreshExpiresIn * 1000,
    };

    localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(accessData));
    localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshData));
  }

  static getAccessToken(): StoredToken | null {
    if (typeof window === 'undefined') return null;

    const data = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static getRefreshToken(): StoredToken | null {
    if (typeof window === 'undefined') return null;

    const data = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static getTokenPair(): StoredTokenPair | null {
    const access = this.getAccessToken();
    const refresh = this.getRefreshToken();

    if (!access || !refresh) {
      return null;
    }

    return { access, refresh };
  }

  static isTokenExpired(token: StoredToken | null, bufferSeconds: number = 60): boolean {
    if (!token) return true;

    const currentTime = Date.now();
    const buffer = bufferSeconds * 1000;

    return currentTime >= token.expires_at - buffer;
  }

  static isAccessTokenExpired(): boolean {
    const accessToken = this.getAccessToken();
    return this.isTokenExpired(accessToken);
  }

  static isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    return this.isTokenExpired(refreshToken);
  }

  static hasValidAccessToken(): boolean {
    const accessToken = this.getAccessToken();
    return accessToken !== null && !this.isTokenExpired(accessToken);
  }

  static hasValidTokenPair(): boolean {
    const tokenPair = this.getTokenPair();
    return (
      tokenPair !== null &&
      !this.isTokenExpired(tokenPair.access) &&
      !this.isTokenExpired(tokenPair.refresh)
    );
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
