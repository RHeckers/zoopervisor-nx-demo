import { Injectable, computed, inject } from '@angular/core';
import { AnimalStore } from '@zoo/animals/data-access';
import { EnclosureStore } from '@zoo/enclosures/data-access';

/**
 * Facade for the feature's SECOND route: one enclosure in full. Same
 * composition story as the map — enclosures domain for the enclosure itself,
 * animals domain for its residents.
 */
@Injectable()
export class EnclosureDetailFacade {
  private readonly enclosures = inject(EnclosureStore);
  private readonly animals = inject(AnimalStore);

  readonly vm = computed(() => {
    const enclosure = this.enclosures.selectedEnclosure();
    const residents = enclosure
      ? this.animals.animals().filter((a) => a.enclosureId === enclosure.id)
      : [];
    return {
      enclosure,
      residents,
      loading: this.animals.loading(),
    };
  });

  /** Re-runs whenever the `:enclosureId` route param changes. */
  select(id: string): void {
    void this.enclosures.loadOne(id);
    // Deep link straight onto this route: the animal store is still empty.
    if (this.animals.animals().length === 0) {
      void this.animals.load('');
    }
  }
}
