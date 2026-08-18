import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import {
  PhotoPickerComponent,
  PhotoThumbsComponent,
  StackComponent,
} from '@zoo/shared/ui/common';

/*
 * <zoo-photo-picker> sits inside a SHARED DOMAIN component, not a feature.
 * Nothing between the app and the picker passes a flag, a slot, or a template:
 * the injector resolves whichever implementation the app registered for
 * PHOTO_PICKER, at exactly this depth. keeper-mobile gets the camera, visitor
 * gets the file input, and ticket-kiosk (which registers nothing) fails closed.
 */
@Component({
  selector: 'zoo-incident-report-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoPickerComponent, PhotoThumbsComponent, StackComponent],
  template: `<zoo-stack>
    <h3>Incident report</h3>
    <zoo-photo-picker [multiple]="true" (selected)="onPicked($event)" />
    @if (picked().length > 0) {
      <zoo-photo-thumbs [files]="picked()" />
      <small>{{ picked().length }} photo(s) attached</small>
    }
  </zoo-stack>`,
})
export class IncidentReportFormComponent {
  readonly photos = output<File[]>();

  protected readonly picked = signal<File[]>([]);

  protected onPicked(files: File[]): void {
    this.picked.update((current) => [...current, ...files]);
    this.photos.emit(this.picked());
  }
}
