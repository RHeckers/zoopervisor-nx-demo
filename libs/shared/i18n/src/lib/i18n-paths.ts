import { InjectionToken } from '@angular/core';

export type I18nPaths = {
  shared: (lang: string) => string;
  app: (lang: string) => string;
};

/**
 * Where the two translation layers live. Overridable per app, but the defaults
 * work everywhere: shared strings are served from /assets/i18n, app overrides
 * from /i18n. The lib names no app — it only knows "shared" and "app".
 */
export const I18N_PATHS = new InjectionToken<I18nPaths>('I18N_PATHS', {
  providedIn: 'root',
  factory: () => ({
    shared: (lang) => `/assets/i18n/${lang}.json`,
    app: (lang) => `/i18n/${lang}.json`,
  }),
});
