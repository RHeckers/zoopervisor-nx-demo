import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Animal } from '@zoo/animals/types';
import { CardComponent } from '@zoo/shared/ui/common';
import { AnimalAvatarComponent } from './animal-avatar.component';

/**
 * Dumb card. No store, no HTTP — just an @Input animal rendered on a surface.
 * With a photo it becomes a media card (full-bleed image on top); without one
 * it stays the compact avatar row. Note the `--zoo-card-padding: 0` line: the
 * consumer override hook from the styling policy doing real work — the card
 * atom is untouched, only this subtree drops its padding for the bleed.
 */
@Component({
  selector: 'zoo-animal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, AnimalAvatarComponent],
  template: `<zoo-card>
    @if (animal().photoUrl; as photo) {
      <img class="zoo-animal-card__photo" [src]="photo" [alt]="animal().name" />
    }
    <span class="zoo-animal-card__body">
      @if (!animal().photoUrl) {
        <zoo-animal-avatar [name]="animal().name" />
      }
      <span class="zoo-animal-card__text">
        <strong>{{ animal().name }}</strong>
        <small>{{ animal().species }}</small>
      </span>
    </span>
  </zoo-card>`,
  styles: `
    :host {
      display: block;
      --zoo-card-padding: 0;
    }
    .zoo-animal-card__photo {
      display: block;
      width: 100%;
      aspect-ratio: var(--zoo-animal-card-photo-ratio, 4 / 3);
      object-fit: cover;
      border-radius: var(--radius-base) var(--radius-base) 0 0;
    }
    .zoo-animal-card__body {
      display: flex;
      align-items: center;
      gap: var(--zoo-animal-card-gap, var(--spacer-base));
      padding: var(--spacer-base);
    }
    .zoo-animal-card__text {
      display: flex;
      flex-direction: column;
    }
  `,
})
export class AnimalCardComponent {
  readonly animal = input.required<Animal>();
}
