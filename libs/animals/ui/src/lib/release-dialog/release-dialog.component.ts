import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

/**
 * AFTER: the confirmation copy is a translation key resolved via the transloco
 * pipe — the wording is owned by whichever app renders it.
 */
@Component({
  selector: 'zoo-release-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
  templateUrl: './release-dialog.component.html',
})
export class ReleaseDialogComponent {
  readonly confirmed = output<void>();
}
