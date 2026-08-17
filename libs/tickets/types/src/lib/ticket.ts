export type TicketKind = 'adult' | 'child' | 'family';

export interface Ticket {
  readonly id: string;
  readonly kind: TicketKind;
  readonly priceCents: number;
}

export interface TicketLine {
  readonly ticketId: string;
  readonly quantity: number;
}
