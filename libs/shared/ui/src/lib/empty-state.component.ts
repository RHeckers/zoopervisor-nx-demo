import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb placeholder shown when a list has nothing to render. */
@Component({
  selector: 'zoo-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="zoo-empty-state">{{ message() }}</p>`,
})
export class EmptyStateComponent {
  readonly message = input('Nothing here yet');
}
