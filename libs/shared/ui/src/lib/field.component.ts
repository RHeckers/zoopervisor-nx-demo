import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb labelled field wrapper; projects a control into the label. */
@Component({
  selector: 'zoo-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="zoo-field">
    <span class="zoo-field__label">{{ label() }}</span>
    <ng-content />
  </div>`,
})
export class FieldComponent {
  readonly label = input.required<string>();
}
