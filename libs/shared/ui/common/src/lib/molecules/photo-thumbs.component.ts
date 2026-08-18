import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
} from '@angular/core';

/**
 * MOLECULE — renders picked File objects as image previews. Object URLs are
 * created once per file and revoked when the component is destroyed, so
 * consumers can just bind `files` and forget about lifecycle.
 */
@Component({
  selector: 'zoo-photo-thumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (photo of previews(); track photo.url) {
    <img class="zoo-photo-thumb" [src]="photo.url" [alt]="photo.name" />
  }`,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--zoo-photo-thumbs-gap, var(--spacer-sm));
    }
    .zoo-photo-thumb {
      width: var(--zoo-photo-thumb-size, 72px);
      height: var(--zoo-photo-thumb-size, 72px);
      object-fit: cover;
      border-radius: var(--zoo-photo-thumb-radius, var(--radius-base));
      box-shadow: var(--zoo-photo-thumb-shadow, var(--shadow-card));
    }
  `,
})
export class PhotoThumbsComponent {
  readonly files = input.required<File[]>();

  private readonly urls = new Map<File, string>();

  protected readonly previews = computed(() =>
    this.files().map((file) => ({ name: file.name, url: this.urlFor(file) })),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const url of this.urls.values()) URL.revokeObjectURL(url);
    });
  }

  private urlFor(file: File): string {
    let url = this.urls.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      this.urls.set(file, url);
    }
    return url;
  }
}
