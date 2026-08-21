import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { VisitorParkStore, VisitorUiStore } from '@zoo/visitor/data-access';

/**
 * Composes enclosures with the animals domain — via the app's COMPOSED
 * VisitorParkStore, which holds both domain features in one store. Every
 * enclosure card lists the animals that live in it. The shared cross-feature
 * search term drives an ANIMAL search (same reactive pattern as animal-list) —
 * so typing "otter" surfaces the enclosure the otters live in, not just
 * enclosures named otter.
 */
@Injectable()
export class EnclosureMapFacade {
  private readonly park = inject(VisitorParkStore);
  private readonly ui = inject(VisitorUiStore);

  private readonly expanded = signal<ReadonlySet<string>>(new Set());

  /*
   * Same debounced-term signal as animal-list: keystrokes settle for 300ms,
   * duplicates are dropped, and the initialValue makes the first load
   * immediate.
   */
  private readonly debouncedTerm = toSignal(
    toObservable(this.ui.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: this.ui.searchTerm() },
  );

  constructor() {
    effect(() => void this.park.load(this.debouncedTerm()));
  }

  readonly vm = computed(() => {
    const term = this.ui.searchTerm().trim().toLowerCase();
    const loaded = this.park.animals();
    return {
      search: this.ui.searchTerm(),
      enclosures: this.park
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
            !term ||
            e.name.toLowerCase().includes(term) ||
            e.residents.length > 0,
        ),
      loading: this.park.parkLoading(),
    };
  });

  refresh(): void {
    void this.park.loadEnclosures();
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
