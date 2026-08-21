import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { initials } from '@zoo/animals/utils';

/**
 * Dumb avatar. Signal inputs only; shows the animal's photo when there is one
 * and falls back to the initials badge (via the domain util) when there isn't.
 */
@Component({
  selector: 'zoo-animal-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './animal-avatar.component.html',
  styleUrl: './animal-avatar.component.css',
})
export class AnimalAvatarComponent {
  readonly name = input.required<string>();
  readonly photoUrl = input<string | undefined>(undefined);
  protected readonly badge = computed(() => initials(this.name()));
}
