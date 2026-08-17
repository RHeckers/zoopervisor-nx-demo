import { InjectionToken } from '@angular/core';
import { Animal, AnimalHealthRecord } from '@zoo/animals/types';

/** The port the animal stores talk to. Swappable via DI so tests/apps can
 *  provide their own transport. */
export interface AnimalApi {
  listAnimals(query: string): Promise<Animal[]>;
  healthForAnimal(animalId: string): Promise<AnimalHealthRecord[]>;
  healthDueToday(): Promise<AnimalHealthRecord[]>;
}

const ANIMALS: readonly Animal[] = [
  { id: 'a1', name: 'Nyah', species: 'Lion', enclosureId: 'savanna' },
  { id: 'a2', name: 'Otto', species: 'Otter', enclosureId: 'aquarium' },
  { id: 'a3', name: 'Pip', species: 'Macaw', enclosureId: 'aviary' },
];

const HEALTH: readonly AnimalHealthRecord[] = [
  { id: 'h1', animalId: 'a1', checkedOn: '2026-08-10', status: 'healthy', dueToday: false },
  { id: 'h2', animalId: 'a2', checkedOn: '2026-08-17', status: 'observation', dueToday: true },
  { id: 'h3', animalId: 'a3', checkedOn: '2026-08-17', status: 'treatment', dueToday: true },
];

/** In-memory fake — the transport is irrelevant to the talk. */
class FakeAnimalApi implements AnimalApi {
  async listAnimals(query: string): Promise<Animal[]> {
    const q = query.trim().toLowerCase();
    return ANIMALS.filter(
      (a) => !q || a.name.toLowerCase().includes(q) || a.species.toLowerCase().includes(q),
    );
  }
  async healthForAnimal(animalId: string): Promise<AnimalHealthRecord[]> {
    return HEALTH.filter((r) => r.animalId === animalId);
  }
  async healthDueToday(): Promise<AnimalHealthRecord[]> {
    return HEALTH.filter((r) => r.dueToday);
  }
}

export const ANIMAL_API = new InjectionToken<AnimalApi>('ANIMAL_API', {
  providedIn: 'root',
  factory: () => new FakeAnimalApi(),
});
