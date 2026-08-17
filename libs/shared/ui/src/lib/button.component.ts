import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Dumb button. Signal input + output only, no store, no domain knowledge. */
@Component({
  selector: 'zoo-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" [disabled]="disabled()" (click)="pressed.emit()">
    <ng-content />
  </button>`,
})
export class ButtonComponent {
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
