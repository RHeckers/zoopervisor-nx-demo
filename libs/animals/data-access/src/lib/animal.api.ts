import { InjectionToken } from '@angular/core';
import { Animal, AnimalHealthRecord, AnimalPage } from '@zoo/animals/types';

/**
 * The port the animal stores talk to. A single-entity store still fronts many
 * requests for that entity — list, read, create, update, delete — so the port
 * is a small CRUD surface. Swappable via DI so tests/apps provide their own.
 */
export interface AnimalApi {
  /** Paged: real backends never return everything at once. */
  listAnimals(query: string, page?: number): Promise<AnimalPage>;
  getAnimal(id: string): Promise<Animal | undefined>;
  createAnimal(input: Omit<Animal, 'id'>): Promise<Animal>;
  updateAnimal(id: string, patch: Partial<Omit<Animal, 'id'>>): Promise<Animal>;
  deleteAnimal(id: string): Promise<void>;
  healthForAnimal(animalId: string): Promise<AnimalHealthRecord[]>;
  healthDueToday(): Promise<AnimalHealthRecord[]>;
}

const HEALTH: readonly AnimalHealthRecord[] = [
  { id: 'h1', animalId: 'a1', checkedOn: '2026-08-10', status: 'healthy', dueToday: false },
  { id: 'h2', animalId: 'a2', checkedOn: '2026-08-17', status: 'observation', dueToday: true },
  { id: 'h3', animalId: 'a3', checkedOn: '2026-08-17', status: 'treatment', dueToday: true },
];

/** In-memory fake — the transport is irrelevant to the talk, the CRUD is not. */
class FakeAnimalApi implements AnimalApi {
  private animals: Animal[] = [
    { id: 'a1', name: 'Nyah', species: 'Lion', enclosureId: 'savanna' },
    { id: 'a2', name: 'Otto', species: 'Otter', enclosureId: 'aquarium' },
    { id: 'a3', name: 'Pip', species: 'Macaw', enclosureId: 'aviary' },
  ];
  private nextId = 4;

  async listAnimals(query: string): Promise<AnimalPage> {
    const q = query.trim().toLowerCase();
    const items = this.animals.filter(
      (a) => !q || a.name.toLowerCase().includes(q) || a.species.toLowerCase().includes(q),
    );
    // The fake is small enough to fit on one page.
    return { items, total: items.length, page: 1 };
  }

  async getAnimal(id: string): Promise<Animal | undefined> {
    return this.animals.find((a) => a.id === id);
  }

  async createAnimal(input: Omit<Animal, 'id'>): Promise<Animal> {
    const created: Animal = { id: `a${this.nextId++}`, ...input };
    this.animals = [...this.animals, created];
    return created;
  }

  async updateAnimal(id: string, patch: Partial<Omit<Animal, 'id'>>): Promise<Animal> {
    const existing = this.animals.find((a) => a.id === id);
    if (!existing) throw new Error(`No animal ${id}`);
    const updated = { ...existing, ...patch };
    this.animals = this.animals.map((a) => (a.id === id ? updated : a));
    return updated;
  }

  async deleteAnimal(id: string): Promise<void> {
    this.animals = this.animals.filter((a) => a.id !== id);
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
