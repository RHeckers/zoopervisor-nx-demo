import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { PhotoSectionComponent } from '@zoo/shared/ui/common';
import { CommandBarComponent } from '@zoo/shared/ui/desktop';

/*
 * APP UI (visitor, platform:desktop). Composes the platform-NEUTRAL photo
 * organism from common with the desktop-only command bar.
 *
 * Notice what is ABSENT:
 *  - no `isMobile` input anywhere in the chain (panel → organism → molecule →
 *    placeholder) — the injector supplies FileInputPhotoPicker because this
 *    app registered it in app.config. No prop drilling.
 *  - no import from @zoo/shared/ui/mobile — and this lib is tagged
 *    platform:desktop, so the boundary rules would reject one outright.
 */
@Component({
  selector: 'zoo-visitor-report-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoSectionComponent, CommandBarComponent],
  template: `<zoo-command-bar (searchChange)="searchChange.emit($event)" />
    <zoo-photo-section heading="Report a sighting" (photosChanged)="photos.emit($event)" />`,
})
export class VisitorReportPanelComponent {
  readonly searchChange = output<string>();
  readonly photos = output<File[]>();
}
