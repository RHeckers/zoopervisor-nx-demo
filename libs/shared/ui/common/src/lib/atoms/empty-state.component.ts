import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb placeholder shown when a list has nothing to render. */
@Component({
  selector: 'zoo-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="zoo-empty-state">{{ message() }}</p>`,
  styles: `
    .zoo-empty-state {
      margin: 0;
      padding: var(--zoo-empty-state-padding, var(--spacer-base));
      color: var(--zoo-empty-state-color, var(--color-muted));
      font-style: italic;
      text-align: center;
    }
  `,
})
export class EmptyStateComponent {
  readonly message = input('Nothing here yet');
}
