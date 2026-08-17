import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PhotoSectionComponent } from '@zoo/shared/ui/common';
import { CommandBarComponent } from './command-bar.component';

/*
 * ORGANISM (desktop-only) — the platform-NEUTRAL zoo-photo-section from common
 * wrapped in desktop chrome: a command bar with keyboard accelerators.
 *
 * This is the layer the placeholder makes possible: a platform component can
 * REUSE the shared photo organism instead of re-implementing it. Only the
 * chrome is desktop-specific; the photo flow inside is untouched, carries no
 * `isMobile` flag, and the picker still resolves from the app's injector —
 * now four levels deep (placeholder → molecule → organism → this workspace).
 * Compare zoo-report-sheet in shared/ui/mobile: same inner organism, different
 * platform shell — the photo code exists exactly once.
 */
@Component({
  selector: 'zoo-report-workspace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommandBarComponent, PhotoSectionComponent],
  template: `<zoo-command-bar
      (searchChange)="searchChange.emit($event)"
      (refresh)="refresh.emit()"
    />
    <zoo-photo-section
      [heading]="heading()"
      (photosChanged)="photos.emit($event)"
    />`,
})
export class ReportWorkspaceComponent {
  readonly heading = input('Report');
  readonly searchChange = output<string>();
  readonly refresh = output<void>();
  readonly photos = output<File[]>();
}
