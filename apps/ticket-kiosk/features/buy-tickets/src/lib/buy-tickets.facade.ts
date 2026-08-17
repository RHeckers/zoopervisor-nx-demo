import { Injectable, computed, inject } from '@angular/core';
import { TicketStore } from '@zoo/tickets/data-access';

/**
 * Composes the tickets domain. Payment is handled by the domain store via the
 * injected PaymentProvider — which THIS app binds to TerminalPayment (see
 * app.config). The facade never names a concrete provider.
 */
@Injectable()
export class BuyTicketsFacade {
  private readonly tickets = inject(TicketStore);

  readonly vm = computed(() => ({
    catalog: this.tickets.catalog(),
    totalCents: this.tickets.totalCents(),
    reference: this.tickets.lastReference(),
  }));

  add(ticketId: string): void {
    this.tickets.add(ticketId);
  }

  checkout(): void {
    void this.tickets.checkout();
  }
}
