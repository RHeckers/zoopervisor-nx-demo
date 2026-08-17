import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TicketPickerComponent } from '@zoo/tickets/ui';
import { ButtonComponent, StackComponent } from '@zoo/shared/ui/common';
import { BuyTicketsFacade } from './buy-tickets.facade';

/** Thin smart component: injects only the facade. */
@Component({
  selector: 'zoo-buy-tickets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BuyTicketsFacade],
  imports: [TicketPickerComponent, ButtonComponent, StackComponent],
  template: `<zoo-stack>
    <zoo-ticket-picker [tickets]="facade.vm().catalog" (pick)="facade.add($event)" />
    <p>Total: {{ (facade.vm().totalCents / 100).toFixed(2) }}</p>
    <zoo-button (pressed)="facade.checkout()">Pay</zoo-button>
    @if (facade.vm().reference; as ref) {
      <p>Paid — reference {{ ref }}</p>
    }
  </zoo-stack>`,
})
export class BuyTicketsComponent {
  protected readonly facade = inject(BuyTicketsFacade);
}
