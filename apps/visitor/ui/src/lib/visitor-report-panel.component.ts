import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { Enclosure } from '@zoo/enclosures/types';
import {
  ButtonComponent,
  FieldComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import { ReportWorkspaceComponent } from '@zoo/shared/ui/desktop';

/** What a park visitor hands in — a community sighting, not a staff record. */
export interface VisitorSighting {
  readonly enclosureId: string | null;
  readonly notes: string;
  readonly shareOnCommunityBoard: boolean;
  readonly photos: File[];
}

/*
 * APP UI (visitor, platform:desktop). Everything around the photo workspace is
 * VISITOR vocabulary: "spotted near", a community-board consent checkbox, a
 * thank-you note — concepts that mean nothing to the keeper or kiosk apps,
 * which is exactly why this panel lives in apps/visitor/ui and not in shared.
 *
 * The photo flow itself stays shared. The chain is five levels:
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
  imports: [
    ButtonComponent,
    FieldComponent,
    ReportWorkspaceComponent,
    StackComponent,
  ],
  templateUrl: './visitor-report-panel.component.html',
  styleUrl: './visitor-report-panel.component.css',
})
export class VisitorReportPanelComponent {
  /** Offered as "spotted near" choices — the app passes its enclosures in. */
  readonly enclosures = input<readonly Enclosure[]>([]);

  readonly photos = output<File[]>();
  readonly submitted = output<VisitorSighting>();

  protected readonly enclosureId = signal<string | null>(null);
  protected readonly notes = signal('');
  protected readonly share = signal(true);
  protected readonly sent = signal(false);

  private attached: File[] = [];

  protected onPhotos(files: File[]): void {
    this.attached = files;
    this.photos.emit(files);
  }

  protected submit(): void {
    this.submitted.emit({
      enclosureId: this.enclosureId(),
      notes: this.notes().trim(),
      shareOnCommunityBoard: this.share(),
      photos: this.attached,
    });
    this.sent.set(true);
  }

  protected reset(): void {
    this.enclosureId.set(null);
    this.notes.set('');
    this.share.set(true);
    this.sent.set(false);
  }
}
