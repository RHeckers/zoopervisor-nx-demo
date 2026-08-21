import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { KeyHintComponent } from '../atoms/key-hint.component';
import { TooltipDirective } from '../atoms/tooltip.directive';

/*
 * MOLECULE (desktop-only) — a search control built on pointer/keyboard atoms:
 * hover tooltip + ⌘K accelerator hint. This one genuinely BELONGS in the
 * desktop lib because its affordances have no meaning on a touch screen.
 * Contrast with the photo molecule in common/, which stays platform-neutral
 * only because the PHOTO_PICKER placeholder pushed the platform choice out.
 * The ⌘K hint is honest: Ctrl/⌘+K really focuses the input.
 */
@Component({
  selector: 'zoo-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyHintComponent, TooltipDirective],
  host: { '(document:keydown)': 'onKeydown($event)' },
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  readonly placeholder = input('Search');
  readonly hint = input('Search everywhere');
  readonly value = input('');
  readonly queryChange = output<string>();

  private readonly searchInput =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  protected onInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInput().nativeElement.focus();
    }
  }
}
