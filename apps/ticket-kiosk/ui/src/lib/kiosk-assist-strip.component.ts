import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

/*
 * APP UI (ticket-kiosk). An unattended walk-up terminal needs chrome that
 * neither of the other apps has any use for: a "call a staff member" escape
 * hatch, a language switch for whoever walks up next, an idle-reset notice,
 * and today's opening hours. That vocabulary — unattended, walk-up, staffed
 * park floor — is what makes this component app-specific; sharing it would
 * force kiosk concepts onto the visitor's browser and the keeper's phone.
 */
@Component({
  selector: 'zoo-kiosk-assist-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kiosk-assist-strip.component.html',
  styleUrl: './kiosk-assist-strip.component.css',
})
export class KioskAssistStripComponent {
  readonly languages = input<readonly string[]>(['en', 'nl']);
  readonly activeLanguage = input('en');
  readonly hoursToday = input('9:00 – 18:00');

  readonly languageChanged = output<string>();

  protected readonly helpRequested = signal(false);
}
