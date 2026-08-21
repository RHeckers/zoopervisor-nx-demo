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
  templateUrl: './visitor-search.slice.html',
  styleUrl: './visitor-search.slice.css',
})
export class VisitorSearchSlice {
  protected readonly ui = inject(VisitorUiStore);
}
