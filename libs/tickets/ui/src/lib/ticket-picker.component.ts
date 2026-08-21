import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Ticket } from '@zoo/tickets/types';

/** Dumb catalog picker. Emits the chosen ticket id; no store, no payment. */
@Component({
  selector: 'zoo-ticket-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-picker.component.html',
  styleUrl: './ticket-picker.component.css',
})
export class TicketPickerComponent {
  readonly tickets = input.required<readonly Ticket[]>();
  readonly pick = output<string>();
}
