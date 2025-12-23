import { useLocalObservable } from 'mobx-react-lite';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api';

export enum AuthStep {
  PHONE_INPUT = 'phone_input',
  WAITING_BOT = 'waiting_bot',
  AUTHENTICATING = 'authenticating',
  AUTHENTICATED = 'authenticated',
  ERROR = 'error',
}

export enum AuthStatus {
  PENDING = 'pending',
  BOT_STARTED = 'bot_started',
  PHONE_SHARED = 'phone_shared',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

const createAuthStore = () => ({
  phoneNumber: '',
  sessionId: '',
  step: AuthStep.PHONE_INPUT,
  authStatus: AuthStatus.PENDING,
  error: '',
  tokens: null as { access_token: string; refresh_token: string } | null,
  channel: null as RealtimeChannel | null,

  get statusText(): string {
    switch (this.authStatus) {
      case AuthStatus.PENDING:
        return 'Ожидание подключения к боту...';
      case AuthStatus.BOT_STARTED:
        return 'Бот запущен';
      case AuthStatus.PHONE_SHARED:
        return 'Номер телефона подтвержден';
      case AuthStatus.APPROVED:
        return 'Авторизация одобрена';
      case AuthStatus.REJECTED:
        return 'Авторизация отклонена';
      default:
        return 'Неизвестный статус';
    }
  },

  setPhoneNumber(phone: string) {
    this.phoneNumber = phone;
  },

  setError(error: string) {
    this.error = error;
    this.step = AuthStep.ERROR;
  },

  async initAuth() {
    try {
      this.error = '';

      const response = await apiClient.initAuth(this.phoneNumber);
      this.sessionId = response.session_id;
      this.step = AuthStep.WAITING_BOT;

      this.subscribeToAuthEvents();
    } catch (err) {
      this.setError('Не удалось инициализировать авторизацию');
      console.error('Init auth error:', err);
    }
  },

  subscribeToAuthEvents() {
    if (this.channel) {
      this.channel.unsubscribe();
    }

    const channelName = `auth:${this.sessionId}`;

    this.channel = supabase.channel(channelName);

    this.channel
      .on('broadcast', { event: 'bot_started' }, (payload) => {
        console.log('Bot started event:', payload);
        this.authStatus = AuthStatus.BOT_STARTED;
        this.step = AuthStep.AUTHENTICATING;
      })
      .on('broadcast', { event: 'phone_shared' }, (payload) => {
        console.log('Phone shared event:', payload);
        this.authStatus = AuthStatus.PHONE_SHARED;
      })
      .on('broadcast', { event: 'auth_approved' }, async (payload) => {
        console.log('Auth approved event:', payload);
        this.authStatus = AuthStatus.APPROVED;
        await this.fetchTokens();
      })
      .on('broadcast', { event: 'auth_rejected' }, (payload) => {
        console.log('Auth rejected event:', payload);
        this.authStatus = AuthStatus.REJECTED;
        this.setError('Авторизация отклонена');
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
  },

  async fetchTokens() {
    try {
      const tokens = await apiClient.getTokens(this.sessionId);
      this.tokens = tokens;
      this.step = AuthStep.AUTHENTICATED;

      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
    } catch (err) {
      this.setError('Не удалось получить токены');
      console.error('Fetch tokens error:', err);
    }
  },

  cleanup() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  },

  reset() {
    this.cleanup();
    this.phoneNumber = '';
    this.sessionId = '';
    this.step = AuthStep.PHONE_INPUT;
    this.authStatus = AuthStatus.PENDING;
    this.error = '';
    this.tokens = null;
  },
});

export const useAuthStore = () => {
  return useLocalObservable(() => createAuthStore());
};
