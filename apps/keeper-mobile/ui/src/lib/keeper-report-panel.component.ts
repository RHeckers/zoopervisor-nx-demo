import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { PhotoSectionComponent } from '@zoo/shared/ui/common';
import {
  ActionSheetComponent,
  SheetActionComponent,
} from '@zoo/shared/ui/mobile';

/*
 * APP UI (keeper-mobile, platform:mobile). The SAME zoo-photo-section organism
 * as the visitor panel — zero duplication across platform folders — but here
 * the injector supplies CameraPhotoPicker, because that is what this app
 * registered. The only mobile-specific code is the genuinely-mobile action
 * sheet around it.
 */
@Component({
  selector: 'zoo-keeper-report-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoSectionComponent, ActionSheetComponent, SheetActionComponent],
  template: `<zoo-photo-section heading="Field report" (photosChanged)="photos.emit($event)" />
    <zoo-action-sheet>
      <zoo-sheet-action label="Send report" (activated)="submitted.emit()" />
    </zoo-action-sheet>`,
})
export class KeeperReportPanelComponent {
  readonly photos = output<File[]>();
  readonly submitted = output<void>();
}
