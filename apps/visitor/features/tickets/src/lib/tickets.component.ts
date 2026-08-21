import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ButtonComponent,
  CardComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import { TicketPickerComponent } from '@zoo/tickets/ui';
import { TicketsFacade } from './tickets.facade';

/** Thin smart component: injects only the facade. */
@Component({
  selector: 'zoo-tickets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TicketsFacade],
  imports: [
    TicketPickerComponent,
    ButtonComponent,
    CardComponent,
    StackComponent,
  ],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent {
  protected readonly facade = inject(TicketsFacade);
}
