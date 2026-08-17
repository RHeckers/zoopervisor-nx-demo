import { Injectable, computed, inject, signal } from '@angular/core';
import { AnimalStore } from '@zoo/animals/data-access';
import { EnclosureStore } from '@zoo/enclosures/data-access';
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

  readonly vm = computed(() => ({
    animals: this.animals.animals(),
    enclosures: this.enclosures.enclosures(),
    search: this.ui.searchTerm(),
    expandedId: this.expandedId(),
    loading: this.animals.loading() || this.enclosures.enclosuresLoading(),
  }));

  refresh(): void {
    void this.animals.load({ query: this.ui.searchTerm() });
    void this.enclosures.loadEnclosures();
  }

  search(term: string): void {
    this.ui.setSearch(term);
    this.refresh();
  }

  open(animalId: string): void {
    this.expandedId.set(animalId);
  }
}
