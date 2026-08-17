import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { catchError, forkJoin, map, of } from 'rxjs';
import { I18N_PATHS } from './i18n-paths';
import { mergeTranslations } from './merge-translations';

@Injectable({ providedIn: 'root' })
export class MergedTranslocoLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly paths = inject(I18N_PATHS);

  getTranslation(lang: string) {
    const shared$ = this.http.get<Translation>(this.paths.shared(lang));

    // App file missing → empty object, app runs untouched.
    const app$ = this.http
      .get<Translation>(this.paths.app(lang))
      .pipe(catchError(() => of({} as Translation)));

    // Shared file missing → the error propagates (a deploy bug must be loud).
    return forkJoin([shared$, app$]).pipe(
      map(([shared, app]) => mergeTranslations(shared, app) as Translation),
    );
  }
}
