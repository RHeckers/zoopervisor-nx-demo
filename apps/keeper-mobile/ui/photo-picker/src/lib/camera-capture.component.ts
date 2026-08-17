import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/*
 * A real keeper-mobile build would drive the device camera here:
 *     import { Camera } from '@capacitor/camera';
 * We keep that behind a comment so the app stays buildable with no native
 * toolchain. This lib is platform:mobile, so importing @capacitor/* is allowed
 * here — a platform:desktop lib doing the same is banned by the boundary rules.
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
