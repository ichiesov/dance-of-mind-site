'use client';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { FormContainer } from './form-container';

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
    <FormContainer>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {isLoading ? 'Загрузка...' : 'Авторизоваться'}
      </button>
    </form>
    </FormContainer>
  );
});

AuthForm.displayName = 'AuthForm';
