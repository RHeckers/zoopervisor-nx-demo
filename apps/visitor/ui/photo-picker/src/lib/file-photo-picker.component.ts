import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { PhotoPickerContract } from '@zoo/shared/ui/photo-picker';

/** The visitor (desktop) implementation: a hidden file input. platform:desktop. */
@Component({
  selector: 'zoo-file-photo-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" (click)="pick()">Add photo</button>
    <input
      #fileInput
      hidden
      type="file"
      accept="image/*"
      [multiple]="multiple()"
      (change)="onSelect($event)"
    />`,
})
export class FileInputPhotoPicker implements PhotoPickerContract {
  readonly multiple = input(false);
  readonly selected = output<File[]>();

  protected readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected pick(): void {
    this.fileInput().nativeElement.click();
  }

  protected onSelect(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.selected.emit(files ? Array.from(files) : []);
  }
}
