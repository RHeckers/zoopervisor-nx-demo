import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A sheet that slides up from the bottom edge — a mobile navigation pattern.
 * It respects the device safe-area inset (notch / home indicator), a concern
 * that only exists on mobile. `platform:mobile`.
 */
@Component({
  selector: 'zoo-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.position]': '"fixed"',
    '[style.left]': '"0"',
    '[style.right]': '"0"',
    '[style.bottom]': '"0"',
    '[style.paddingBottom]': 'safeArea',
    '[style.borderTopLeftRadius]': '"1rem"',
    '[style.borderTopRightRadius]': '"1rem"',
  },
  template: `<ng-content />`,
})
export class BottomSheetComponent {
  // env(safe-area-inset-bottom) is a mobile-only CSS capability.
  protected readonly safeArea = 'env(safe-area-inset-bottom, 12px)';
}
