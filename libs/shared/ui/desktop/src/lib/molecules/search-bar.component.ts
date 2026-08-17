import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { KeyHintComponent } from '../atoms/key-hint.component';
import { TooltipDirective } from '../atoms/tooltip.directive';

/*
 * MOLECULE (desktop-only) — a search control built on pointer/keyboard atoms:
 * hover tooltip + ⌘K accelerator hint. This one genuinely BELONGS in the
 * desktop lib because its affordances have no meaning on a touch screen.
 * Contrast with the photo molecule in common/, which stays platform-neutral
 * only because the PHOTO_PICKER placeholder pushed the platform choice out.
 */
@Component({
  selector: 'zoo-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyHintComponent, TooltipDirective],
  template: `<span [zooTooltip]="hint()">
      <input
        type="search"
        [placeholder]="placeholder()"
        (input)="onInput($event)"
      />
    </span>
    <zoo-key-hint keys="⌘K" />`,
})
export class SearchBarComponent {
  readonly placeholder = input('Search');
  readonly hint = input('Search everywhere');
  readonly queryChange = output<string>();

  protected onInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
