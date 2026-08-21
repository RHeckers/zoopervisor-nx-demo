import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { PhotoPickerContract } from '@zoo/shared/ui/common';
import { CameraCaptureComponent } from '../atoms/camera-capture.component';

/**
 * The MOBILE implementation of the photo-picker contract: the device camera.
 * Lives in the platform lib — any mobile app registers it via
 * providePhotoPicker(CameraPhotoPicker).
 */
@Component({
  selector: 'zoo-camera-photo-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CameraCaptureComponent],
  templateUrl: './camera-photo-picker.component.html',
})
export class CameraPhotoPicker implements PhotoPickerContract {
  readonly multiple = input(false);
  readonly selected = output<File[]>();

  protected readonly capture = viewChild.required(CameraCaptureComponent);

  protected open(): void {
    this.capture().open();
  }
}
