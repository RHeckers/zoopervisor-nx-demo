import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb ticket-kiosk-ui component — signal inputs only, no store, no HTTP. */
@Component({
  selector: 'zoo-ticket-kiosk-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="zoo-ticket-kiosk-ui">{{ label() }}</span>`,
})
export class TicketKioskUiComponent {
  readonly label = input('');
}
