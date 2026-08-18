import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent, CardComponent, StackComponent } from '@zoo/shared/ui/common';
import { TicketPickerComponent } from '@zoo/tickets/ui';
import { TicketsFacade } from './tickets.facade';

/** Thin smart component: injects only the facade. */
@Component({
  selector: 'zoo-tickets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TicketsFacade],
  imports: [TicketPickerComponent, ButtonComponent, CardComponent, StackComponent],
  template: `<zoo-card>
    <zoo-stack>
      <h3>Day tickets</h3>
      <zoo-ticket-picker [tickets]="facade.vm().catalog" (pick)="facade.add($event)" />
      <p class="tickets-total">Total: € {{ (facade.vm().totalCents / 100).toFixed(2) }}</p>
      <zoo-button (pressed)="facade.checkout()">Pay online</zoo-button>
      @if (facade.vm().reference; as ref) {
        <p class="tickets-paid">Paid — reference {{ ref }}</p>
      }
    </zoo-stack>
  </zoo-card>`,
})
export class TicketsComponent {
  protected readonly facade = inject(TicketsFacade);
}
