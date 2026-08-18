import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonComponent, StackComponent } from '@zoo/shared/ui/common';
import { KeyHintComponent } from '../atoms/key-hint.component';
import { SearchBarComponent } from '../molecules/search-bar.component';

/*
 * ORGANISM (desktop-only) — the search-bar molecule + a shortcut-labelled
 * action, laid out with common atoms. Inherently desktop: it is *about*
 * keyboard accelerators. Platform-specific organisms live in the platform lib;
 * only platform-NEUTRAL ones (like zoo-photo-section) earn a spot in common.
 * What the search and the action MEAN is the host's business — it labels them.
 */
@Component({
  selector: 'zoo-command-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StackComponent, ButtonComponent, KeyHintComponent, SearchBarComponent],
  template: `<zoo-stack direction="row">
    <zoo-search-bar
      [placeholder]="searchPlaceholder()"
      [hint]="searchHint()"
      [value]="searchValue()"
      (queryChange)="searchChange.emit($event)"
    />
    <zoo-button (pressed)="action.emit()">
      {{ actionLabel() }} <zoo-key-hint [keys]="actionKeys()" />
    </zoo-button>
  </zoo-stack>`,
})
export class CommandBarComponent {
  readonly searchPlaceholder = input('Search');
  readonly searchHint = input('Search everywhere');
  readonly searchValue = input('');
  readonly actionLabel = input('Refresh');
  readonly actionKeys = input('F5');
  readonly searchChange = output<string>();
  readonly action = output<void>();
}
