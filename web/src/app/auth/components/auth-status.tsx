'use client';

import { observer } from 'mobx-react-lite';
import { AuthStatus as AuthStatusEnum } from '../store';

interface AuthStatusProps {
  status: AuthStatusEnum;
  statusText: string;
  showBotLink?: boolean;
  onReset?: () => void;
}

export const AuthStatus = observer(
  ({ status, statusText, showBotLink = false, onReset }: AuthStatusProps) => {
    const BOT_URL = 'https://t.me/dance_of_mind_bot';

    const isRejected = status === AuthStatusEnum.REJECTED;
    const isApproved = status === AuthStatusEnum.APPROVED;

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-white/70 text-sm">Статус авторизации</p>
            <p
              className={`text-xl font-medium ${
                isApproved ? 'text-green-400' : isRejected ? 'text-red-400' : 'text-white'
              }`}
            >
              {statusText}
            </p>
          </div>

          {showBotLink && !isApproved && !isRejected && (
            <div className="space-y-3">
              <p className="text-white/80">Перейдите в бота для подтверждения</p>
              <a
                href={BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              >
                Открыть бота
              </a>
            </div>
          )}

          {isApproved && (
            <div className="space-y-3">
              <p className="text-green-400">✓ Вы успешно авторизованы!</p>
            </div>
          )}

          {isRejected && onReset && (
            <button
              onClick={onReset}
              className="w-full px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            >
              Попробовать снова
            </button>
          )}
        </div>

        {!isApproved && !isRejected && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
            <div
              className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        )}
      </div>
    );
  }
);

AuthStatus.displayName = 'AuthStatus';
