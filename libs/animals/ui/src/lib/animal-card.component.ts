import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Animal } from '@zoo/animals/types';
import { CardComponent } from '@zoo/shared/ui';
import { AnimalAvatarComponent } from './animal-avatar.component';

/** Dumb card. No store, no HTTP — just an @Input animal rendered on a surface. */
@Component({
  selector: 'zoo-animal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, AnimalAvatarComponent],
  template: `<zoo-card>
    <zoo-animal-avatar [name]="animal().name" />
    <strong>{{ animal().name }}</strong>
    <small>{{ animal().species }}</small>
  </zoo-card>`,
})
export class AnimalCardComponent {
  readonly animal = input.required<Animal>();
}
