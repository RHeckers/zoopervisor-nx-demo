import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BottomSheetComponent } from '../atoms/bottom-sheet.component';

/*
 * ORGANISM (mobile-only) — a bottom sheet hosting projected sheet-actions.
 * Inherently mobile (edge-swipe sheet, safe-area inset), so it lives in the
 * platform lib rather than common.
 */
@Component({
  selector: 'zoo-action-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BottomSheetComponent],
  template: `<zoo-bottom-sheet><ng-content /></zoo-bottom-sheet>`,
})
export class ActionSheetComponent {}
