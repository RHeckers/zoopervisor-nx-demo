import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ReportWorkspaceComponent } from '@zoo/shared/ui/desktop';

/*
 * APP UI (visitor, platform:desktop). Consumes the desktop report-workspace
 * organism, which itself wraps the platform-neutral photo organism from
 * common. The full chain is now five levels:
 *
 *   photo-picker placeholder (common atom)
 *     → photo-upload-field (common molecule)
 *       → photo-section (common organism)
 *         → report-workspace (desktop organism)
 *           → this panel (app ui)
 *
 * Not one of those levels passes an `isMobile` flag or imports anything from
 * shared/ui/mobile (this lib is platform:desktop, so the boundary rules would
 * reject it). The picker resolves to FileInputPhotoPicker at the innermost
 * level purely because this app registered it in app.config.
 */
@Component({
  selector: 'zoo-visitor-report-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReportWorkspaceComponent],
  templateUrl: './visitor-report-panel.component.html',
})
export class VisitorReportPanelComponent {
  readonly photos = output<File[]>();
}
