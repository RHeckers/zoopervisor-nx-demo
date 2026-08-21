import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Ticket, TicketKind } from '@zoo/tickets/types';

/** Which glyph stands for which ticket kind is tickets-domain knowledge. */
const KIND_GLYPHS: Record<TicketKind, string> = {
  adult: '🧑',
  child: '🧒',
  family: '👨‍👩‍👧‍👦',
};

/**
 * Dumb catalog picker. Emits the chosen ticket id; no store, no payment. It
 * DOES own the domain's presentation: the glyph per ticket kind lives here,
 * and the kind label is an i18n key (tickets.kind.*) so each app keeps its
 * own wording without this component knowing any app.
 */
@Component({
  selector: 'zoo-ticket-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  templateUrl: './ticket-picker.component.html',
  styleUrl: './ticket-picker.component.css',
})
export class TicketPickerComponent {
  readonly tickets = input.required<readonly Ticket[]>();
  readonly pick = output<string>();

  protected readonly glyphs = KIND_GLYPHS;
}
