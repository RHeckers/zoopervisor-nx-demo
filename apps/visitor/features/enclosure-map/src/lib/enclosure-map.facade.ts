import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map, of, switchMap, timer } from 'rxjs';
import { AnimalStore } from '@zoo/animals/data-access';
import { EnclosureStore } from '@zoo/enclosures/data-access';
import { VisitorUiStore } from '@zoo/visitor/data-access';

/**
 * Composes enclosures with the animals domain: every enclosure card lists the
 * animals that live in it. The shared cross-feature search term drives an
 * ANIMAL search (same reactive pattern as animal-list) — so typing "otter"
 * surfaces the enclosure the otters live in, not just enclosures named otter.
 */
@Injectable()
export class EnclosureMapFacade {
  private readonly enclosures = inject(EnclosureStore);
  private readonly animals = inject(AnimalStore);
  private readonly ui = inject(VisitorUiStore);

  private readonly expanded = signal<ReadonlySet<string>>(new Set());

  /*
   * Same declarative debounce as animal-list: the search signal becomes a
   * stream, the first value loads immediately, later keystrokes restart a
   * 300ms timer, and the subscription dies with the facade.
   */
  private readonly reloadOnSearch = toObservable(this.ui.searchTerm)
    .pipe(
      switchMap((term, index) =>
        index === 0 ? of(term) : timer(300).pipe(map(() => term)),
      ),
      takeUntilDestroyed(),
    )
    .subscribe((term) => void this.animals.load(term));

  readonly vm = computed(() => {
    const term = this.ui.searchTerm().trim().toLowerCase();
    const loaded = this.animals.animals();
    return {
      search: this.ui.searchTerm(),
      enclosures: this.enclosures
        .enclosures()
        .map((e) => ({
          ...e,
          residents: loaded.filter((a) => a.enclosureId === e.id),
          expanded: this.expanded().has(e.id),
        }))
        // With a term: keep enclosures whose NAME matches or that HOUSE a match
        // (residents already reflect the searched animal store).
        .filter(
          (e) =>
            !term || e.name.toLowerCase().includes(term) || e.residents.length > 0,
        ),
      loading: this.enclosures.enclosuresLoading() || this.animals.loading(),
    };
  });

  refresh(): void {
    void this.enclosures.loadEnclosures();
  }

  toggleExpanded(id: string): void {
    this.expanded.update((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
