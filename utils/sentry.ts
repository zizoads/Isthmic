import * as Sentry from '@sentry/react';

export const initSentry = () => {
  // تفعيل Sentry فقط في بيئة الإنتاج لضمان الخصوصية أثناء التطوير
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: 'production',
    });
  }
};

export const captureSovereignError = (error: Error, context?: any) => {
  console.error("[SOVEREIGN_EXCEPTION]:", error);
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context });
  }
};