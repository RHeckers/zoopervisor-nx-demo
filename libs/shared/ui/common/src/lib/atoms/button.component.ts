import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

/** Dumb button. Signal input + output only, no store, no domain knowledge. */
@Component({
  selector: 'zoo-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
