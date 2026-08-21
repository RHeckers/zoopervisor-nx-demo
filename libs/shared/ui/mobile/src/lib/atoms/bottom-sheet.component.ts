import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A sheet that slides up from the bottom edge — a mobile navigation pattern.
 * It respects the device safe-area inset (notch / home indicator), a concern
 * that only exists on mobile. All values are CSS custom properties: global
 * tokens as defaults, `--zoo-bottom-sheet-*` as consumer override hooks.
 * `platform:mobile`.
 */
@Component({
  selector: 'zoo-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.css',
})
export class BottomSheetComponent {}
