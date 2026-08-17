import {
  ChangeDetectionStrategy,
  Component,
  output,
} from '@angular/core';
import { ButtonComponent, StackComponent } from '@zoo/shared/ui/common';
import { KeyHintComponent } from '../atoms/key-hint.component';
import { SearchBarComponent } from '../molecules/search-bar.component';

/*
 * ORGANISM (desktop-only) — the search-bar molecule + shortcut-labelled
 * actions, laid out with common atoms. Inherently desktop: it is *about*
 * keyboard accelerators. Platform-specific organisms live in the platform lib;
 * only platform-NEUTRAL ones (like zoo-photo-section) earn a spot in common.
 */
@Component({
  selector: 'zoo-command-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StackComponent, ButtonComponent, KeyHintComponent, SearchBarComponent],
  template: `<zoo-stack direction="row">
    <zoo-search-bar (queryChange)="searchChange.emit($event)" />
    <zoo-button (pressed)="refresh.emit()">
      Refresh <zoo-key-hint keys="F5" />
    </zoo-button>
  </zoo-stack>`,
})
export class CommandBarComponent {
  readonly searchChange = output<string>();
  readonly refresh = output<void>();
}
