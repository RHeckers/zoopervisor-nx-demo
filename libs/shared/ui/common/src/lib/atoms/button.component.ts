import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Dumb button. Signal input + output only, no store, no domain knowledge. */
@Component({
  selector: 'zoo-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" [disabled]="disabled()" (click)="pressed.emit()">
    <ng-content />
  </button>`,
  styles: `
    button {
      font: inherit;
      font-size: var(--zoo-button-font-size, 1rem);
      padding: var(--zoo-button-padding, var(--spacer-sm) var(--spacer-base));
      border: none;
      border-radius: var(--zoo-button-radius, var(--radius-base));
      background: var(--zoo-button-background, var(--color-accent));
      color: var(--zoo-button-color, var(--color-paper));
      cursor: pointer;
    }
    button:hover:not(:disabled) {
      filter: brightness(1.1);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
  `,
})
export class ButtonComponent {
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
