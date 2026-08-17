import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { MergedTranslocoLoader } from './merged-transloco-loader';

/**
 * One call an app drops into its providers to get merged shared+app
 * translations. The lib names no app — each app supplies only its own override
 * file (or none, taking the missing-file path).
 */
export function provideZooI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'nl'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: false,
      },
      loader: MergedTranslocoLoader,
    }),
  ]);
}
