export interface PaymentResult {
  readonly ok: boolean;
  readonly reference: string;
}

/**
 * An abstract class used as its own DI token. The domain depends only on this
 * shape; the concrete implementation is provided per app:
 *   - ticket-kiosk provides TerminalPayment (chip-and-pin terminal)
 *   - visitor      provides OnlinePayment  (hosted card form)
 *
 * `inject(PaymentProvider)` resolves whichever the app registered.
 */
export abstract class PaymentProvider {
  abstract pay(amountCents: number): Promise<PaymentResult>;
}
