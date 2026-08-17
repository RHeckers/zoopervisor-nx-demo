import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { CardComponent } from '../atoms/card.component';
import { EmptyStateComponent } from '../atoms/empty-state.component';
import { StackComponent } from '../atoms/stack.component';
import { PhotoUploadFieldComponent } from '../molecules/photo-upload-field.component';

/*
 * ORGANISM — card + stack + the photo-upload-field molecule + an empty state.
 * Also exists ONCE, in common.
 *
 * The whole chain — placeholder → molecule → organism → app panel — carries no
 * `isMobile` prop at any level (no prop drilling), and no mobile import ever
 * appears in a desktop app: the platform choice was made a single time, in the
 * app's providers (providePhotoPicker). Without that, this organism and its
 * molecule would both be duplicated across shared/ui/desktop and
 * shared/ui/mobile just to swap the innermost leaf.
 */
@Component({
  selector: 'zoo-photo-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    StackComponent,
    EmptyStateComponent,
    PhotoUploadFieldComponent,
  ],
  template: `<zoo-card>
    <zoo-stack>
      <h4>{{ heading() }}</h4>
      <zoo-photo-upload-field [count]="files().length" (files)="onFiles($event)" />
      @if (files().length === 0) {
        <zoo-empty-state />
      } @else {
        @for (f of files(); track $index) {
          <small>{{ f.name }}</small>
        }
      }
    </zoo-stack>
  </zoo-card>`,
})
export class PhotoSectionComponent {
  readonly heading = input('Photos');
  readonly photosChanged = output<File[]>();

  protected readonly files = signal<File[]>([]);

  protected onFiles(files: File[]): void {
    this.files.set(files);
    this.photosChanged.emit(files);
  }
}
