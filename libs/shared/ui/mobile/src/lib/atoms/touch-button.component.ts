import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Haptics } from '../native/haptics';

/**
 * A big, thumb-reachable tap target that fires native haptic feedback. The
 * minimum size comes from the global `--tap-target-min` token (48px), with
 * `--zoo-touch-button-min-size` as the consumer override hook. The tap-size
 * guarantee and the `Haptics.impact` call are what make this a *mobile*
 * control — neither belongs on a pointer-driven desktop. Tagged
 * `platform:mobile`, so `platform:desktop` libs cannot import it.
 */
@Component({
  selector: 'zoo-touch-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" (click)="onTap()"><ng-content /></button>`,
  styles: `
    :host {
      display: inline-block;
      min-height: var(--zoo-touch-button-min-size, var(--tap-target-min));
      min-width: var(--zoo-touch-button-min-size, var(--tap-target-min));
      touch-action: manipulation;
    }
  `,
})
export class TouchButtonComponent {
  readonly tapped = output<void>();

  protected async onTap(): Promise<void> {
    await Haptics.impact('medium');
    this.tapped.emit();
  }
}
