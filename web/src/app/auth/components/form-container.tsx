'use client';

import { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

export const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-white/20">
      {children}
    </div>
  );
};
