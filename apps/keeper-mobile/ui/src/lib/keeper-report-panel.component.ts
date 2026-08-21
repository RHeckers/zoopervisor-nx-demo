import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { ReportSheetComponent } from '@zoo/shared/ui/mobile';

export type ReportUrgency = 'routine' | 'concern' | 'urgent';

/** What a keeper files from the field — a staff record, not a visitor story. */
export interface KeeperFieldReport {
  readonly urgency: ReportUrgency;
  readonly tags: readonly string[];
  readonly photos: File[];
}

/*
 * APP UI (keeper-mobile, platform:mobile). The chrome around the photo sheet
 * is KEEPER vocabulary: an urgency triage (routine / concern / urgent) and
 * one-tap shift tags instead of free-text typing — gloves on, one hand,
 * standing in an enclosure. None of that means anything to the visitor or
 * kiosk apps, which is why this panel lives in apps/keeper-mobile/ui.
 *
 * The photo flow is still the SAME zoo-photo-section the visitor panel gets
 * via the desktop report-workspace — it exists once, in common. Only the
 * platform shells differ, and this app's injector supplies CameraPhotoPicker
 * to the picker atom at the innermost level.
 */
@Component({
  selector: 'zoo-keeper-report-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReportSheetComponent],
  templateUrl: './keeper-report-panel.component.html',
  styleUrl: './keeper-report-panel.component.css',
})
export class KeeperReportPanelComponent {
  /** Context line — which animal this field report is about. */
  readonly animalName = input('');

  readonly photos = output<File[]>();
  readonly submitted = output<KeeperFieldReport>();

  protected readonly urgencies: readonly ReportUrgency[] = [
    'routine',
    'concern',
    'urgent',
  ];
  /** One-tap shift shorthand — faster than typing with gloves on. */
  protected readonly quickTags = [
    'fed',
    'medicated',
    'behaviour',
    'enclosure damage',
  ];

  protected readonly urgency = signal<ReportUrgency>('routine');
  protected readonly tags = signal<ReadonlySet<string>>(new Set());
  protected readonly sent = signal(false);

  private attached: File[] = [];

  protected onPhotos(files: File[]): void {
    this.attached = files;
    this.photos.emit(files);
  }

  protected toggleTag(tag: string): void {
    this.tags.update((current) => {
      const next = new Set(current);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  protected submit(): void {
    this.submitted.emit({
      urgency: this.urgency(),
      tags: [...this.tags()],
      photos: this.attached,
    });
    this.sent.set(true);
  }
}
