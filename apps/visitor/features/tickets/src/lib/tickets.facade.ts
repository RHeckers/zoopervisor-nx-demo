import { Injectable, computed, inject } from '@angular/core';
import { TicketStore } from '@zoo/tickets/data-access';

/*
 * The SAME TicketStore the ticket-kiosk uses — but checkout() runs through
 * OnlinePayment here, because that is what THIS app bound the abstract
 * PaymentProvider token to. Neither the store nor this facade names a concrete
 * provider; compare the reference in the paid message ("ONLINE-…" here,
 * "TERMINAL-…" on the kiosk).
 */
@Injectable()
export class TicketsFacade {
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
