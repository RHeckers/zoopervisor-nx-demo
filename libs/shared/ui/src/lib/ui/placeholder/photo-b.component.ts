import { Component, input, output, viewChild, ElementRef, effect } from '@angular/core';
import { PhotoPickerContract } from './photo-picker.contract';

@Component({
  selector: 'lib-file-photo-picker',
  template: `
    <button type="button">
      Add photo {{multiple()}}
    </button>

    <input
      #fileInput
      hidden
      type="file"
      accept="image/*"
      [multiple]="multiple()"
      (change)="onSelect($event)"
    />
  `,
})
export class FileInputPhotoPicker implements PhotoPickerContract {
  readonly multiple = input(false);
  readonly selected = output<File[]>();

  protected readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected onSelect(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.selected.emit(files ? [...files] : []);
  }

  constructor() {
    effect(() => {
      console.log('Input ==>', this.multiple());
    })
  }
}
