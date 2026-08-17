import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { initials } from '@zoo/animals/utils';

/** Dumb avatar. Signal input only; leans on the domain util for its badge. */
@Component({
  selector: 'zoo-animal-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="zoo-animal-avatar" [attr.aria-label]="name()">{{ badge() }}</span>`,
})
export class AnimalAvatarComponent {
  readonly name = input.required<string>();
  protected readonly badge = computed(() => initials(this.name()));
}
