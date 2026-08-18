import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Ticket } from '@zoo/tickets/types';

/** Dumb catalog picker. Emits the chosen ticket id; no store, no payment. */
@Component({
  selector: 'zoo-ticket-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (t of tickets(); track t.id) {
    <button type="button" (click)="pick.emit(t.id)">
      <span class="zoo-ticket-picker__kind">{{ t.kind }}</span>
      <span class="zoo-ticket-picker__price">€ {{ (t.priceCents / 100).toFixed(2) }}</span>
    </button>
  }`,
  styles: `
    :host {
      display: flex;
      gap: var(--zoo-ticket-picker-gap, var(--spacer-sm));
      flex-wrap: wrap;
    }
    button {
      font: inherit;
      display: flex;
      flex-direction: column;
      gap: var(--spacer-xs);
      padding: var(--zoo-ticket-picker-padding, var(--spacer-base));
      border: 1px solid var(--color-muted);
      border-radius: var(--radius-base);
      background: var(--color-paper);
      cursor: pointer;
    }
    button:hover {
      border-color: var(--color-accent);
    }
    .zoo-ticket-picker__kind {
      text-transform: capitalize;
      font-weight: 600;
    }
    .zoo-ticket-picker__price {
      color: var(--color-muted);
    }
  `,
})
export class TicketPickerComponent {
  readonly tickets = input.required<readonly Ticket[]>();
  readonly pick = output<string>();
}
