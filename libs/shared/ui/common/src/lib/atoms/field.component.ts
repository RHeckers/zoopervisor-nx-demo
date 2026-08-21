import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb labelled field wrapper; projects a control into the label. */
@Component({
  selector: 'zoo-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field.component.html',
  styleUrl: './field.component.css',
})
export class FieldComponent {
  readonly label = input.required<string>();
}
