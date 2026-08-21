import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Animal, HealthStatus } from '@zoo/animals/types';
import { CardComponent } from '@zoo/shared/ui/common';
import { AnimalAvatarComponent } from './animal-avatar.component';

/**
 * Dumb card. No store, no HTTP — just an @Input animal rendered on a surface.
 * With a photo it becomes a media card (full-bleed image on top); without one
 * it stays the compact avatar row. Note the `--zoo-card-padding: 0` line: the
 * consumer override hook from the styling policy doing real work — the card
 * atom is untouched, only this subtree drops its padding for the bleed.
 *
 * The optional `health` input is domain vocabulary: how each HealthStatus
 * looks (the dot palette in the stylesheet) is the animals domain's call, not
 * a consumer's.
 */
@Component({
  selector: 'zoo-animal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, AnimalAvatarComponent],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.css',
})
export class AnimalCardComponent {
  readonly animal = input.required<Animal>();
  /** Shown as a status dot when the consumer knows it (keeper pages do). */
  readonly health = input<HealthStatus | undefined>(undefined);
}
