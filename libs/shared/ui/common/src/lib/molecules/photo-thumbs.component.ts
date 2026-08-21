import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

/**
 * MOLECULE — renders picked File objects as image previews. Object URLs are
 * created once per file and revoked when the component is destroyed, so
 * consumers can just bind `files` and forget about lifecycle. With
 * `removable`, each thumb gets an ✕ — the OWNER of the files decides what
 * removal means; this molecule only reports it.
 */
@Component({
  selector: 'zoo-photo-thumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-thumbs.component.html',
  styleUrl: './photo-thumbs.component.css',
})
export class PhotoThumbsComponent {
  readonly files = input.required<File[]>();
  readonly removable = input(false);
  readonly removed = output<File>();

  private readonly urls = new Map<File, string>();

  protected readonly previews = computed(() =>
    this.files().map((file) => ({
      file,
      name: file.name,
      url: this.urlFor(file),
    })),
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
