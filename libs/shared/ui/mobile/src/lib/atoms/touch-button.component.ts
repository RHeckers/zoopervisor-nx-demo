import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Haptics } from '../native/haptics';

/**
 * A big, thumb-reachable tap target that fires native haptic feedback. The
 * 48px minimum and the `Haptics.impact` call are what make this a *mobile*
 * control — neither belongs on a pointer-driven desktop. Tagged
 * `platform:mobile`, so `platform:desktop` libs cannot import it.
 */
@Component({
  selector: 'zoo-touch-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.minHeight]': '"48px"',
    '[style.minWidth]': '"48px"',
    '[style.touchAction]': '"manipulation"',
  },
  template: `<button type="button" (click)="onTap()"><ng-content /></button>`,
})
export class TouchButtonComponent {
  readonly tapped = output<void>();

  protected async onTap(): Promise<void> {
    await Haptics.impact('medium');
    this.tapped.emit();
  }
}
