import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TicketPickerComponent } from '@zoo/tickets/ui';
import { ButtonComponent, StackComponent } from '@zoo/shared/ui/common';
import { BuyTicketsFacade } from './buy-tickets.facade';

/** Thin smart component: injects only the facade. */
@Component({
  selector: 'zoo-buy-tickets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BuyTicketsFacade],
  imports: [TicketPickerComponent, ButtonComponent, StackComponent],
  templateUrl: './buy-tickets.component.html',
})
export class BuyTicketsComponent {
  protected readonly facade = inject(BuyTicketsFacade);
}
