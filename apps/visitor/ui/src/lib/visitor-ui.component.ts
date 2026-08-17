import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb visitor-ui component — signal inputs only, no store, no HTTP. */
@Component({
  selector: 'zoo-visitor-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="zoo-visitor-ui">{{ label() }}</span>`,
})
export class VisitorUiComponent {
  readonly label = input('');
}
