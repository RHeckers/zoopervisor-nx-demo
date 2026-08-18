import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Animal } from '@zoo/animals/types';
import { CardComponent } from '@zoo/shared/ui/common';
import { AnimalAvatarComponent } from './animal-avatar.component';

/** Dumb card. No store, no HTTP — just an @Input animal rendered on a surface. */
@Component({
  selector: 'zoo-animal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, AnimalAvatarComponent],
  template: `<zoo-card>
    <span class="zoo-animal-card">
      <zoo-animal-avatar [name]="animal().name" />
      <span class="zoo-animal-card__text">
        <strong>{{ animal().name }}</strong>
        <small>{{ animal().species }}</small>
      </span>
    </span>
  </zoo-card>`,
  styles: `
    .zoo-animal-card {
      display: flex;
      align-items: center;
      gap: var(--zoo-animal-card-gap, var(--spacer-base));
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
