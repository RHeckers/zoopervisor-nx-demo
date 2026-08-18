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
  template: `@for (photo of previews(); track photo.url) {
    <span class="zoo-photo-thumb__frame">
      <img class="zoo-photo-thumb" [src]="photo.url" [alt]="photo.name" />
      @if (removable()) {
        <button
          type="button"
          class="zoo-photo-thumb__remove"
          [attr.aria-label]="'Remove ' + photo.name"
          (click)="removed.emit(photo.file)"
        >
          ✕
        </button>
      }
    </span>
  }`,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--zoo-photo-thumbs-gap, var(--spacer-sm));
    }
    .zoo-photo-thumb__frame {
      position: relative;
      display: inline-flex;
    }
    .zoo-photo-thumb {
      width: var(--zoo-photo-thumb-size, 72px);
      height: var(--zoo-photo-thumb-size, 72px);
      object-fit: cover;
      border-radius: var(--zoo-photo-thumb-radius, var(--radius-base));
      box-shadow: var(--zoo-photo-thumb-shadow, var(--shadow-card));
    }
    .zoo-photo-thumb__remove {
      position: absolute;
      top: calc(-1 * var(--spacer-xs));
      right: calc(-1 * var(--spacer-xs));
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: var(--color-ink);
      color: var(--color-paper);
      font-size: var(--font-size-caption);
      cursor: pointer;
    }
    .zoo-photo-thumb__remove:hover {
      background: var(--color-accent);
    }
  `,
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
