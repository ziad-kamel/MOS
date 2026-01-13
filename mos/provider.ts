'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(
    NextThemesProvider,
    { attribute: "class", defaultTheme: "system", enableSystem: true },
    children
  );
}
