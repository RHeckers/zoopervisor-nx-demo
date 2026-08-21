import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

/**
 * AFTER: the confirmation copy is a translation key resolved via the transloco
 * structural directive (one subscription for the whole template, and `t(...)`
 * works in bindings too) — the wording is owned by whichever app renders it.
 */
@Component({
  selector: 'zoo-release-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  templateUrl: './release-dialog.component.html',
})
export class ReleaseDialogComponent {
  readonly confirmed = output<void>();
}
