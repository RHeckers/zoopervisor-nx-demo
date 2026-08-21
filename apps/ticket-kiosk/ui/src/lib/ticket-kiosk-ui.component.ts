import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb ticket-kiosk-ui component — signal inputs only, no store, no HTTP. */
@Component({
  selector: 'zoo-ticket-kiosk-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-kiosk-ui.component.html',
})
export class TicketKioskUiComponent {
  readonly label = input('');
}
