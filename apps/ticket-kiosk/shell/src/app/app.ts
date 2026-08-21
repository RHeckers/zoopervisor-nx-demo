import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { KioskAssistStripComponent } from '@zoo/ticket-kiosk/ui';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    KioskAssistStripComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly transloco = inject(TranslocoService);

  /** Follows transloco wherever the language is changed, not just here. */
  protected readonly lang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected setLang(lang: string): void {
    this.transloco.setActiveLang(lang);
  }
}
