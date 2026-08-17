import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Ticket } from '@zoo/tickets/types';

/** Dumb catalog picker. Emits the chosen ticket id; no store, no payment. */
@Component({
  selector: 'zoo-ticket-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (t of tickets(); track t.id) {
    <button type="button" (click)="pick.emit(t.id)">
      {{ t.kind }} — {{ (t.priceCents / 100).toFixed(2) }}
    </button>
  }`,
})
export class TicketPickerComponent {
  readonly tickets = input.required<readonly Ticket[]>();
  readonly pick = output<string>();
}
