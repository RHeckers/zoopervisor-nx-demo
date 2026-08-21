import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EnclosureOccupancySlice } from '@zoo/enclosures/slices';
import { ButtonComponent, StackComponent } from '@zoo/shared/ui/common';
import { TicketStore } from '@zoo/tickets/data-access';
import { TicketPickerComponent } from '@zoo/tickets/ui';

/*
 * Smart routed page WITHOUT a facade — one domain store, no composition, no
 * page logic, so the component talks to the store directly. Payment still
 * goes through the injected PaymentProvider, which THIS app binds to
 * TerminalPayment (see app.config); nothing here names a concrete provider.
 */
@Component({
  selector: 'zoo-buy-tickets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EnclosureOccupancySlice,
    TicketPickerComponent,
    ButtonComponent,
    StackComponent,
  ],
  templateUrl: './buy-tickets.component.html',
})
export class BuyTicketsComponent {
  protected readonly tickets = inject(TicketStore);

  protected checkout(): void {
    void this.tickets.checkout();
  }
}
