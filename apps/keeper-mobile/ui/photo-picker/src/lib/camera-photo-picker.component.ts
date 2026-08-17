import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { PhotoPickerContract } from '@zoo/shared/ui/photo-picker';
import { CameraCaptureComponent } from './camera-capture.component';

/** The keeper-mobile implementation: the device camera. platform:mobile. */
@Component({
  selector: 'zoo-camera-photo-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CameraCaptureComponent],
  template: `<button type="button" (click)="open()">Add photo</button>
    <zoo-camera-capture #capture (captured)="selected.emit([$event])" />`,
})
export class CameraPhotoPicker implements PhotoPickerContract {
  readonly multiple = input(false);
  readonly selected = output<File[]>();

  protected readonly capture = viewChild.required(CameraCaptureComponent);

  protected open(): void {
    this.capture().open();
  }
}
