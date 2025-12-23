'use client';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';

interface AuthFormProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading?: boolean;
}

export const AuthForm = observer(({ onSubmit, isLoading = false }: AuthFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onSubmit(phoneNumber);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
          Номер телефона
        </label>
        <input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+7 (999) 123-45-67"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !phoneNumber.trim()}
        className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Загрузка...' : 'Авторизоваться'}
      </button>
    </form>
  );
});

AuthForm.displayName = 'AuthForm';
