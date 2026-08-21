import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb busy indicator. */
@Component({
  selector: 'zoo-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', '[attr.aria-label]': 'label()' },
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  readonly label = input('Loading…');
}
