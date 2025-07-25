'use client';

import { ReactNode } from 'react';

export default function ProductsTheme({ children }: { children: ReactNode }) {
  return (
    <div className="theme-navy">
      {children}
    </div>
  );
}