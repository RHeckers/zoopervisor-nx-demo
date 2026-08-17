import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PhotoSectionComponent } from '@zoo/shared/ui/common';
import { SheetActionComponent } from '../molecules/sheet-action.component';
import { ActionSheetComponent } from './action-sheet.component';

/*
 * ORGANISM (mobile-only) — the SAME platform-neutral zoo-photo-section that
 * zoo-report-workspace (desktop) wraps, here dressed in mobile chrome: an
 * action sheet with a thumb-sized submit action.
 *
 * The photo flow is not duplicated for mobile — this component only adds the
 * shell. No `isMobile` prop enters the inner organism, and the picker inside
 * it resolves to the camera because the mobile app registered
 * CameraPhotoPicker; the identical inner organism resolves to the file input
 * on desktop. One photo implementation, two platform shells.
 */
@Component({
  selector: 'zoo-report-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoSectionComponent, ActionSheetComponent, SheetActionComponent],
  template: `<zoo-photo-section
      [heading]="heading()"
      (photosChanged)="photos.emit($event)"
    />
    <zoo-action-sheet>
      <zoo-sheet-action [label]="submitLabel()" (activated)="submitted.emit()" />
    </zoo-action-sheet>`,
})
export class ReportSheetComponent {
  readonly heading = input('Report');
  readonly submitLabel = input('Send');
  readonly photos = output<File[]>();
  readonly submitted = output<void>();
}
