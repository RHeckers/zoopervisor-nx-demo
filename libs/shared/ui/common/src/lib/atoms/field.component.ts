import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb labelled field wrapper; projects a control into the label. */
@Component({
  selector: 'zoo-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="zoo-field">
    <span class="zoo-field__label">{{ label() }}</span>
    <ng-content />
  </div>`,
  styles: `
    .zoo-field {
      display: flex;
      flex-direction: column;
      gap: var(--zoo-field-gap, var(--spacer-xs));
    }
    .zoo-field__label {
      font-size: var(--zoo-field-label-size, var(--font-size-caption));
      color: var(--zoo-field-label-color, var(--color-muted));
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  `,
})
export class FieldComponent {
  readonly label = input.required<string>();
}
