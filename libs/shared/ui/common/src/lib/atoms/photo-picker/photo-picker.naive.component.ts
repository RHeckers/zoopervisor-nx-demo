import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { CameraCaptureComponent } from './camera-capture.component';

/*
 * ⚠️ ANTI-PATTERN — kept for the slide (photo-picker task, "before").
 *
 * Shared decides at runtime how to take a photo. Three costs, all visible here:
 *   1. shared imports the camera component,
 *   2. every consumer must thread `isMobile` down to this component,
 *   3. both implementations ship to both apps.
 *
 * The "after" replaces this with a DI token (PHOTO_PICKER) and a placeholder
 * that renders whichever implementation the app provided.
 */
@Component({
  selector: 'zoo-photo-picker-naive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CameraCaptureComponent],
  template: `<button type="button" (click)="open()">Add photo</button>

    @if (isMobile() && showCamera()) {
      <zoo-camera-capture (captured)="onCaptured($event)" />
    }

    @if (!isMobile()) {
      <input hidden type="file" (change)="onSelect($event)" />
    }`,
})
export class PhotoPickerNaiveComponent {
  readonly isMobile = input.required<boolean>();
  readonly selected = output<File[]>();

  protected readonly showCamera = signal(false);

  protected open(): void {
    this.showCamera.set(true);
  }

  protected onCaptured(file: File): void {
    this.selected.emit([file]);
  }

  protected onSelect(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.selected.emit(files ? Array.from(files) : []);
  }
}
