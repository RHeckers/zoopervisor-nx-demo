import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
  private readonly enclosureFilter = signal<string | null>(null);

  /*
   * The cross-feature search term, debounced back into a signal: keystrokes
   * settle for 300ms before it changes, duplicates are dropped, and the
   * initialValue makes the very first load immediate.
   */
  private readonly debouncedTerm = toSignal(
    toObservable(this.ui.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: this.ui.searchTerm() },
  );

  constructor() {
    // The one side effect the facade owns: whatever set the term (top search
    // slice, command bar), the list reloads when the debounced signal settles.
    effect(() => void this.animals.load(this.debouncedTerm()));
  }

  readonly vm = computed(() => {
    const loaded = this.animals.animals();
    const filter = this.enclosureFilter();
    const shown = filter
      ? loaded.filter((a) => a.enclosureId === filter)
      : loaded;
    return {
      animals: shown,
      total: this.animals.total(),
      enclosures: this.enclosures.enclosures(),
      enclosureFilter: filter,
      search: this.ui.searchTerm(),
      // Reaches @zoo/shared/utils — which drags the whole barrel in, including
      // the deliberately non-tree-shakeable ZONE_LABELS. See §10 / show-retention.
      heading: titleCase(this.ui.searchTerm() || 'all animals'),
      expandedId: this.expandedId(),
      loading: this.animals.loading() || this.enclosures.enclosuresLoading(),
      // More pages exist server-side (independent of the local enclosure filter).
      canLoadMore: loaded.length > 0 && loaded.length < this.animals.total(),
    };
  });

  refresh(): void {
    void this.enclosures.loadEnclosures();
  }

  loadMore(): void {
    void this.animals.loadMore(this.ui.searchTerm());
  }

  /** Feature-local filter — clicking the active chip clears it. */
  toggleEnclosure(id: string): void {
    this.enclosureFilter.update((current) => (current === id ? null : id));
  }

  open(animalId: string): void {
    this.expandedId.set(animalId);
  }
}
