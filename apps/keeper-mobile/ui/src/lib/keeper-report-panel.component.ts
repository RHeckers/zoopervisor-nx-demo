import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ReportSheetComponent } from '@zoo/shared/ui/mobile';

/*
 * APP UI (keeper-mobile, platform:mobile). Consumes the mobile report-sheet
 * organism — which wraps the SAME zoo-photo-section the visitor panel gets via
 * the desktop report-workspace. The photo code exists once, in common; only
 * the platform shells differ, and this app's injector supplies
 * CameraPhotoPicker to the picker atom at the innermost level.
 */
@Component({
  selector: 'zoo-keeper-report-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReportSheetComponent],
  template: `<zoo-report-sheet
    heading="Field report"
    submitLabel="Send report"
    (photos)="photos.emit($event)"
    (submitted)="submitted.emit()"
  />`,
})
export class KeeperReportPanelComponent {
  readonly photos = output<File[]>();
  readonly submitted = output<void>();
}
