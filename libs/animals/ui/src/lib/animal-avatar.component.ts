import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { initials } from '@zoo/animals/utils';

/** Dumb avatar. Signal input only; leans on the domain util for its badge. */
@Component({
  selector: 'zoo-animal-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="zoo-animal-avatar" [attr.aria-label]="name()">{{ badge() }}</span>`,
  styles: `
    .zoo-animal-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--zoo-animal-avatar-size, 2.5rem);
      height: var(--zoo-animal-avatar-size, 2.5rem);
      border-radius: 50%;
      background: var(--zoo-animal-avatar-background, var(--color-savanna));
      color: var(--zoo-animal-avatar-color, var(--color-ink));
      font-weight: 700;
      font-size: var(--font-size-caption);
    }
  `,
})
export class AnimalAvatarComponent {
  readonly name = input.required<string>();
  protected readonly badge = computed(() => initials(this.name()));
}
