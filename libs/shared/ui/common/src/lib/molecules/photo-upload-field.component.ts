import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PhotoPickerComponent } from '../atoms/photo-picker/photo-picker.component';
import { BadgeComponent } from '../atoms/badge.component';
import { FieldComponent } from '../atoms/field.component';

/*
 * MOLECULE — atoms + the photo-picker placeholder composed into one labelled
 * control. This file exists ONCE, in common.
 *
 * Without the PHOTO_PICKER placeholder this molecule would have to exist twice:
 * a copy in shared/ui/desktop wired to the file input and a copy in
 * shared/ui/mobile wired to the camera — and every consumer in between would
 * thread an `isMobile` flag down to pick one. Instead `<zoo-photo-picker>`
 * resolves the platform implementation from the injector, so the molecule
 * stays platform-neutral and passes no flag anywhere.
 */
@Component({
  selector: 'zoo-photo-upload-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldComponent, BadgeComponent, PhotoPickerComponent],
  template: `<zoo-field [label]="label()">
    <zoo-photo-picker [multiple]="true" (selected)="files.emit($event)" />
    @if (count() > 0) {
      <zoo-badge tone="leaf">{{ count() }}</zoo-badge>
    }
  </zoo-field>`,
})
export class PhotoUploadFieldComponent {
  readonly label = input('Photos');
  readonly count = input(0);
  readonly files = output<File[]>();
}
