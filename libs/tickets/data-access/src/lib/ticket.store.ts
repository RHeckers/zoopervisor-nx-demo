import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Ticket, TicketLine } from '@zoo/tickets/types';
import { PaymentProvider } from './payment-provider';

const CATALOG: readonly Ticket[] = [
  { id: 'adult', kind: 'adult', priceCents: 2400 },
  { id: 'child', kind: 'child', priceCents: 1200 },
  { id: 'family', kind: 'family', priceCents: 6000 },
];

interface TicketState {
  catalog: Ticket[];
  lines: TicketLine[];
  lastReference: string | null;
}

/** The reusable feature — compose it into a facade or a composed store. */
export function ticketStoreFeature() {
  return signalStoreFeature(
    withState<TicketState>({
      catalog: [...CATALOG],
      lines: [],
      lastReference: null,
    }),
    withComputed(({ catalog, lines }) => ({
      totalCents: computed(() =>
        lines().reduce((sum, line) => {
          const ticket = catalog().find((t) => t.id === line.ticketId);
          return sum + (ticket ? ticket.priceCents * line.quantity : 0);
        }, 0),
      ),
    })),
    withMethods((store) => {
      // Resolved from whichever PaymentProvider the app provides.
      const payment = inject(PaymentProvider);
      return {
        add(ticketId: string, quantity = 1): void {
          patchState(store, { lines: [...store.lines(), { ticketId, quantity }] });
        },
        async checkout(): Promise<void> {
          const result = await payment.pay(store.totalCents());
          patchState(store, { lastReference: result.reference, lines: [] });
        },
      };
    }),
  );
}

/** The full store — inject it directly when you don't need to compose. */
export const TicketStore = signalStore({ providedIn: 'root' }, ticketStoreFeature());
