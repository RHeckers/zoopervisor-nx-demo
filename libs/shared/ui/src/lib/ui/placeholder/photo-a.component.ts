import { Component, input, output } from '@angular/core';
import { PhotoPickerContract } from './photo-picker.contract';


@Component({
  selector: 'lib-camera-photo-picker',
  imports: [],
  template: `
    <button type="button">Add photo A {{multiple()}}</button>
  `,
})
export class CameraPhotoPicker implements PhotoPickerContract {
  readonly multiple = input(false);
  readonly selected = output<File[]>();
}
