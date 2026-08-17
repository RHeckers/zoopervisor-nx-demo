import { Injectable } from '@angular/core';
import { PaymentProvider, PaymentResult } from '@zoo/tickets/data-access';

/**
 * The visitor (web) binding of the abstract PaymentProvider token: a hosted
 * online card form. ticket-kiosk binds the same token to TerminalPayment —
 * same domain store, different concrete provider per app.
 */
@Injectable()
export class OnlinePayment extends PaymentProvider {
  async pay(amountCents: number): Promise<PaymentResult> {
    return { ok: true, reference: `ONLINE-${amountCents}` };
  }
}
