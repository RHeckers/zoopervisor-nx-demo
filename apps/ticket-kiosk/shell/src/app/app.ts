import { Component, inject, signal } from '@angular/core';
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

  protected readonly lang = signal(this.transloco.getActiveLang());

  protected setLang(lang: string): void {
    this.transloco.setActiveLang(lang);
    this.lang.set(lang);
  }
}
