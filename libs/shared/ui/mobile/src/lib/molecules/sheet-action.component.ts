import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TouchButtonComponent } from '../atoms/touch-button.component';

/*
 * MOLECULE (mobile-only) — a labelled, haptic, thumb-sized action row built on
 * the touch-button atom. Genuinely belongs here: 48px tap targets and haptics
 * are mobile affordances. Contrast with the photo molecule in common/, which
 * needs no mobile copy because the PHOTO_PICKER placeholder made it neutral.
 */
@Component({
  selector: 'zoo-sheet-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TouchButtonComponent],
  template: `<zoo-touch-button (tapped)="activated.emit()">
    {{ label() }}
  </zoo-touch-button>`,
})
export class SheetActionComponent {
  readonly label = input.required<string>();
  readonly activated = output<void>();
}
