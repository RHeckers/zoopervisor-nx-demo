import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * BEFORE (anti-pattern): the confirmation copy is hard-coded in the template
 * (release-dialog.component.html). Task A replaces it with a translation key.
 */
@Component({
  selector: 'zoo-release-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './release-dialog.component.html',
})
export class ReleaseDialogComponent {
  readonly confirmed = output<void>();
}
