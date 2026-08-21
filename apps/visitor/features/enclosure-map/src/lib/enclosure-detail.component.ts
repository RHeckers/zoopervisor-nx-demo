import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimalCardComponent } from '@zoo/animals/ui';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import {
  EmptyStateComponent,
  SpinnerComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import { EnclosureDetailFacade } from './enclosure-detail.facade';

/**
 * The feature's second routed view (/enclosures/:enclosureId). The router
 * binds the path param to the `enclosureId` input (withComponentInputBinding
 * in app.config), so deep links and in-app navigation both just work.
 */
@Component({
  selector: 'zoo-enclosure-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EnclosureDetailFacade],
  imports: [
    AnimalCardComponent,
    EmptyStateComponent,
    EnclosureBadgeComponent,
    RouterLink,
    SpinnerComponent,
    StackComponent,
  ],
  templateUrl: './enclosure-detail.component.html',
  styleUrl: './enclosure-detail.component.css',
})
export class EnclosureDetailComponent {
  protected readonly facade = inject(EnclosureDetailFacade);

  readonly enclosureId = input.required<string>();

  constructor() {
    effect(() => this.facade.select(this.enclosureId()));
  }
}
