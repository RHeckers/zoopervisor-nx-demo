import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb placeholder shown when a list has nothing to render. */
@Component({
  selector: 'zoo-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
})
export class EmptyStateComponent {
  readonly message = input('Nothing here yet');
}
