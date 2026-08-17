import { Injectable } from '@angular/core';
import { PaymentProvider, PaymentResult } from '@zoo/tickets/data-access';

/**
 * The ticket-kiosk binding of the abstract PaymentProvider token: a
 * chip-and-pin terminal. visitor binds the same token to OnlinePayment.
 */
@Injectable()
export class TerminalPayment extends PaymentProvider {
  async pay(amountCents: number): Promise<PaymentResult> {
    return { ok: true, reference: `TERMINAL-${amountCents}` };
  }
}
