'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      containerClassName=""
    //   toastOptions={{
    //     className: '!bg-background !text-foreground !border !border-border',
    //     duration: 5000,
    //     success: {
    //       iconTheme: {
    //         primary: 'hsl(var(--success))',
    //         secondary: 'hsl(var(--success-foreground))',
    //       },
    //     },
    //     error: {
    //       iconTheme: {
    //         primary: 'hsl(var(--destructive))',
    //         secondary: 'hsl(var(--destructive-foreground))',
    //       },
    //     },
    //   }}
    />
  );
}