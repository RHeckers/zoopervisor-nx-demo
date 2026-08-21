import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ButtonComponent,
  CardComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import { TicketStore } from '@zoo/tickets/data-access';
import { TicketPickerComponent } from '@zoo/tickets/ui';

/*
 * Smart routed page WITHOUT a facade: it reads exactly one domain store and
 * adds no composition or page logic, so a facade would be a pure
 * pass-through. Compare animal-list, which composes three stores and earns
 * its facade.
 *
 * The store still hides the transport — checkout() runs through OnlinePayment
 * here because that is what THIS app bound the abstract PaymentProvider token
 * to (the kiosk binds TerminalPayment; compare the "ONLINE-…" vs "TERMINAL-…"
 * references).
 */
@Component({
  selector: 'zoo-tickets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TicketPickerComponent,
    ButtonComponent,
    CardComponent,
    StackComponent,
  ],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent {
  protected readonly tickets = inject(TicketStore);

  protected checkout(): void {
    void this.tickets.checkout();
  }
}
