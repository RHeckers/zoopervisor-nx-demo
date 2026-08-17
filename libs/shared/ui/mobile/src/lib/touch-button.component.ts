import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * A big, touch-sized control. Tagged `platform:mobile`, so anything
 * `platform:desktop` is forbidden from importing it by the boundary rules.
 */
@Component({
  selector: 'zoo-touch-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.minHeight]': '"48px"', '[style.minWidth]': '"48px"' },
  template: `<button type="button" (click)="tapped.emit()"><ng-content /></button>`,
})
export class TouchButtonComponent {
  readonly label = input('');
  readonly tapped = output<void>();
}
