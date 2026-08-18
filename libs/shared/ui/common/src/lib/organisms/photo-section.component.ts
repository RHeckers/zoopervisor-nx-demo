import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CardComponent } from '../atoms/card.component';
import { EmptyStateComponent } from '../atoms/empty-state.component';
import { StackComponent } from '../atoms/stack.component';
import { PhotoThumbsComponent } from '../molecules/photo-thumbs.component';
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
    PhotoThumbsComponent,
    PhotoUploadFieldComponent,
  ],
  template: `<zoo-card>
    <zoo-stack>
      <h4>{{ heading() }}</h4>
      <zoo-photo-upload-field [count]="files().length" (files)="onFiles($event)" />
      @if (files().length === 0) {
        <zoo-empty-state />
      } @else if (visible().length === 0) {
        <zoo-empty-state message="No photos match the filter" />
      } @else {
        <zoo-photo-thumbs
          [files]="visible()"
          [removable]="true"
          (removed)="removeFile($event)"
        />
      }
    </zoo-stack>
  </zoo-card>`,
})
export class PhotoSectionComponent {
  readonly heading = input('Photos');
  /** Optional name filter — hosts (e.g. the desktop workspace) wire it. */
  readonly nameFilter = input('');
  readonly photosChanged = output<File[]>();

  protected readonly files = signal<File[]>([]);

  protected readonly visible = computed(() => {
    const filter = this.nameFilter().trim().toLowerCase();
    return filter
      ? this.files().filter((f) => f.name.toLowerCase().includes(filter))
      : this.files();
  });

  protected onFiles(files: File[]): void {
    // Accumulate: each pick ADDS to the report instead of replacing it.
    this.files.update((current) => [...current, ...files]);
    this.photosChanged.emit(this.files());
  }

  protected removeFile(file: File): void {
    this.files.update((current) => current.filter((f) => f !== file));
    this.photosChanged.emit(this.files());
  }
}
