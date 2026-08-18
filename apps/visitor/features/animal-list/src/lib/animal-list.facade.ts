import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AnimalStore } from '@zoo/animals/data-access';
import { EnclosureStore } from '@zoo/enclosures/data-access';
import { titleCase } from '@zoo/shared/utils';
import { VisitorUiStore } from '@zoo/visitor/data-access';

/**
 * Composes TWO domains (animals + enclosures) plus the app's cross-feature UI
 * store, and exposes a single view model plus intent methods. Feature-local UI
 * state (which animal is expanded) lives here; cross-feature state (the search
 * term) is injected from visitor/data-access.
 */
@Injectable()
export class AnimalListFacade {
  private readonly animals = inject(AnimalStore);
  private readonly enclosures = inject(EnclosureStore);
  private readonly ui = inject(VisitorUiStore);

  private readonly expandedId = signal<string | null>(null);
  private firstLoad = true;

  constructor() {
    // The facade REACTS to the cross-feature search term: wherever it is set
    // (top search slice, command bar), the list reloads. Debounced so typing
    // doesn't fire a request per keystroke; the first run loads immediately.
    effect((onCleanup) => {
      const term = this.ui.searchTerm();
      if (this.firstLoad) {
        this.firstLoad = false;
        void this.animals.load(term);
        return;
      }
      const handle = setTimeout(() => void this.animals.load(term), 300);
      onCleanup(() => clearTimeout(handle));
    });
  }

  readonly vm = computed(() => ({
    animals: this.animals.animals(),
    enclosures: this.enclosures.enclosures(),
    search: this.ui.searchTerm(),
    // Reaches @zoo/shared/utils — which drags the whole barrel in, including
    // the deliberately non-tree-shakeable ZONE_LABELS. See §10 / show-retention.
    heading: titleCase(this.ui.searchTerm() || 'all animals'),
    expandedId: this.expandedId(),
    loading: this.animals.loading() || this.enclosures.enclosuresLoading(),
  }));

  refresh(): void {
    void this.enclosures.loadEnclosures();
  }

  search(term: string): void {
    this.ui.setSearch(term);
  }

  open(animalId: string): void {
    this.expandedId.set(animalId);
  }
}
