import { Injectable, computed, inject } from '@angular/core';
import { EnclosureStore } from '@zoo/enclosures/data-access';
import { VisitorUiStore } from '@zoo/visitor/data-access';

/**
 * A leaner facade: one domain (enclosures) plus the shared app UI store. It
 * filters enclosures by the same cross-feature search term used by animal-list.
 */
@Injectable()
export class EnclosureMapFacade {
  private readonly enclosures = inject(EnclosureStore);
  private readonly ui = inject(VisitorUiStore);

  readonly vm = computed(() => {
    const term = this.ui.searchTerm().toLowerCase();
    return {
      enclosures: this.enclosures
        .enclosures()
        .filter((e) => !term || e.name.toLowerCase().includes(term)),
      loading: this.enclosures.enclosuresLoading(),
    };
  });

  refresh(): void {
    void this.enclosures.loadEnclosures();
  }
}
