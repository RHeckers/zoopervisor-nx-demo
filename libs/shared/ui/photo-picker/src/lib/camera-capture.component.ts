import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * A stub camera. That this component lives in SHARED at all is part of the
 * anti-pattern the naive picker demonstrates — the "after" moves the camera out
 * of shared entirely.
 */
@Component({
  selector: 'zoo-camera-capture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" (click)="open()">Capture</button>`,
})
export class CameraCaptureComponent {
  readonly captured = output<File>();

  open(): void {
    this.captured.emit(new File([], 'photo.jpg', { type: 'image/jpeg' }));
  }
}
