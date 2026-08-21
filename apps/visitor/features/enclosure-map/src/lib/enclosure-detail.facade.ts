import { Injectable, computed, inject } from '@angular/core';
import { VisitorParkStore } from '@zoo/visitor/data-access';

/**
 * Facade for the feature's SECOND route: one enclosure in full. It injects the
 * app's COMPOSED park store — one store, both domains — and drives it with the
 * page-shaped `openEnclosure` call. Because the map page shares the same store
 * instance, animals loaded there are already cached here.
 */
@Injectable()
export class EnclosureDetailFacade {
  private readonly park = inject(VisitorParkStore);

  readonly vm = computed(() => {
    const enclosure = this.park.selectedEnclosure();
    const residents = enclosure
      ? this.park.animals().filter((a) => a.enclosureId === enclosure.id)
      : [];
    return {
      enclosure,
      residents,
      loading: this.park.loading(),
    };
  });

  /** Re-runs whenever the `:enclosureId` route param changes. */
  select(id: string): void {
    void this.park.openEnclosure(id);
  }
}
