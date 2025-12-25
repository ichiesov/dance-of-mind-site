'use client';

import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, AuthStep } from './store';
import { AuthForm, AuthStatus, FormContainer } from './components';

import wallImg from 'images/wall.webp';

const AuthPage = observer(() => {
  const store = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    return () => {
      store.cleanup();
    };
  }, [store]);

  // Редирект на comedy-tragedy после успешной авторизации
  useEffect(() => {
    if (store.step === AuthStep.AUTHENTICATED) {
      router.push('/comedy-tragedy');
    }
  }, [store.step, router]);

  const handleSubmit = async (phoneNumber: string) => {
    store.setPhoneNumber(phoneNumber);
    await store.initAuth();
  };

  const handleReset = () => {
    store.reset();
  };

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image */}
      <Image
        src={wallImg}
        alt="Background"
        className="object-cover"
        fill
        priority
      />

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dance of Mind</h1>
          <p className="text-white/60">Авторизация через Telegram</p>
        </div>

        {store.step === AuthStep.PHONE_INPUT && (
          <AuthForm onSubmit={handleSubmit} isLoading={store.isLoading} />
        )}

        {store.step === AuthStep.WAITING_BOT && (
          <AuthStatus
            status={store.authStatus}
            statusText={store.statusText}
            showBotLink={true}
            onReset={handleReset}
          />
        )}

        {store.step === AuthStep.AUTHENTICATING && (
          <AuthStatus
            status={store.authStatus}
            statusText={store.statusText}
            showBotLink={false}
            onReset={handleReset}
          />
        )}

        {store.step === AuthStep.AUTHENTICATED && (
          <AuthStatus
            status={store.authStatus}
            statusText={store.statusText}
            showBotLink={false}
          />
        )}

        {store.step === AuthStep.ERROR && (
          <FormContainer>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 text-center">{store.error}</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              >
                Попробовать снова
              </button>
            </div>
          </FormContainer>
        )}
      </div>
    </div>
  );
});

AuthPage.displayName = 'AuthPage';

export default AuthPage;
