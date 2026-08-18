import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VisitorUiStore } from '@zoo/visitor/data-access';

/*
 * An APP-LEVEL slice (contrast with the domain slice in libs/animals/slices).
 * It is smart and self-wiring like a domain slice, but it reaches into the
 * app's cross-feature UI store rather than a domain store — so it is reusable
 * across this app's features and is used in both animal-list and enclosure-map.
 */
@Component({
  selector: 'zoo-visitor-search-slice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<input
    type="search"
    placeholder="Search any animal — try lion, otter, macaw…"
    aria-label="Search animals"
    [value]="ui.searchTerm()"
    (input)="ui.setSearch($any($event.target).value)"
  />`,
  styles: `
    :host {
      display: block;
    }
    input {
      font: inherit;
      width: 100%;
      box-sizing: border-box;
      padding: var(--zoo-search-padding, var(--spacer-sm) var(--spacer-base));
      border: 1px solid var(--color-muted);
      border-radius: var(--zoo-search-radius, var(--radius-base));
      background: var(--color-paper);
    }
    input:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 1px;
    }
  `,
})
export class VisitorSearchSlice {
  protected readonly ui = inject(VisitorUiStore);
}
