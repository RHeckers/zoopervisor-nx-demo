import {
  Animal,
  AnimalHealthRecord,
  AnimalPage,
  HealthStatus,
} from '@zoo/animals/types';
import { createZooApiClient } from '@zoo/shared/data-access';
import { AnimalApi } from './animal.api';

/** iNaturalist is free, keyless and CORS-open — ideal for a live demo. */
const INAT_BASE_URL = 'https://api.inaturalist.org/v1';

/** The slice of an iNaturalist taxon this adapter reads. */
interface InatTaxon {
  id: number;
  name: string;
  preferred_common_name?: string;
  iconic_taxon_name?: string;
  default_photo?: { medium_url?: string } | null;
}

/** Rough habitat mapping so live species land in an existing enclosure. */
const ENCLOSURE_BY_ICONIC: Readonly<Record<string, string>> = {
  Aves: 'aviary',
  Actinopterygii: 'aquarium',
  Amphibia: 'aquarium',
  Mollusca: 'aquarium',
};

/**
 * A REAL implementation of the AnimalApi port, backed by the public
 * iNaturalist taxa API. The visitor app swaps it in with one provider line —
 * no store, facade or component changes anywhere. Writes are an in-memory
 * overlay (iNaturalist is read-only): created animals, edits and deletions
 * are applied on top of whatever the live API returns.
 */
export class InatAnimalApi implements AnimalApi {
  private readonly client = createZooApiClient(INAT_BASE_URL);

  private readonly seen = new Map<string, Animal>();
  private created: Animal[] = [];
  private healthAdded: AnimalHealthRecord[] = [];
  private readonly edits = new Map<string, Partial<Omit<Animal, 'id'>>>();
  private readonly deleted = new Set<string>();
  private nextId = 1;

  async listAnimals(query: string, page = 1): Promise<AnimalPage> {
    // Demo-only pacing: give the list's skeleton state a beat on screen
    // instead of flickering away on fast connections.
    await new Promise((resolve) => setTimeout(resolve, 600));

    const q = query.trim();
    // Without a query: most-observed animal species worldwide (taxon 1 = Animalia).
    const base = q
      ? `/taxa?q=${encodeURIComponent(q)}&rank=species&per_page=12`
      : '/taxa?taxon_id=1&rank=species&order_by=observations_count&order=desc&per_page=12';

    const { results, total_results } = await this.client.get<{
      results: InatTaxon[];
      total_results: number;
    }>(`${base}&page=${page}`);
    const fetched = results
      .filter((t) => t.default_photo?.medium_url)
      .map((t) => this.toAnimal(t));

    const lower = q.toLowerCase();
    // Locally created animals only join the FIRST page — they aren't on the server.
    const createdMatches =
      page === 1
        ? this.created.filter(
            (a) =>
              !lower ||
              a.name.toLowerCase().includes(lower) ||
              a.species.toLowerCase().includes(lower),
          )
        : [];

    const items = [...createdMatches, ...fetched]
      .filter((a) => !this.deleted.has(a.id))
      .map((a) => ({ ...a, ...this.edits.get(a.id) }));

    return { items, total: total_results + this.created.length, page };
  }

  async getAnimal(id: string): Promise<Animal | undefined> {
    const known = this.seen.get(id);
    return known ? { ...known, ...this.edits.get(id) } : undefined;
  }

  async createAnimal(input: Omit<Animal, 'id'>): Promise<Animal> {
    const animal: Animal = { id: `local-${this.nextId++}`, ...input };
    this.created = [animal, ...this.created];
    this.seen.set(animal.id, animal);
    return animal;
  }

  async updateAnimal(
    id: string,
    patch: Partial<Omit<Animal, 'id'>>,
  ): Promise<Animal> {
    const existing = await this.getAnimal(id);
    if (!existing) throw new Error(`No animal ${id}`);
    this.edits.set(id, { ...this.edits.get(id), ...patch });
    return { ...existing, ...patch };
  }

  async deleteAnimal(id: string): Promise<void> {
    this.deleted.add(id);
  }

  async healthForAnimal(animalId: string): Promise<AnimalHealthRecord[]> {
    const added = this.healthAdded.filter((r) => r.animalId === animalId);
    const animal = await this.getAnimal(animalId);
    return animal ? [this.toHealthRecord(animal, 0), ...added] : added;
  }

  async healthDueToday(): Promise<AnimalHealthRecord[]> {
    if (this.seen.size === 0) await this.listAnimals('');
    return [...this.seen.values()]
      .slice(0, 3)
      .map((a, i) => this.toHealthRecord(a, i));
  }

  async addHealthRecord(
    animalId: string,
    status: HealthStatus,
    tags: readonly string[] = [],
  ): Promise<AnimalHealthRecord> {
    // Writes are an in-memory overlay, like the animal CRUD above.
    const record: AnimalHealthRecord = {
      id: `health-added-${this.healthAdded.length + 1}`,
      animalId,
      checkedOn: new Date().toISOString().slice(0, 10),
      status,
      dueToday: false,
      tags,
    };
    this.healthAdded = [...this.healthAdded, record];
    return record;
  }

  private toAnimal(taxon: InatTaxon): Animal {
    const common = taxon.preferred_common_name ?? taxon.name;
    const animal: Animal = {
      id: `inat-${taxon.id}`,
      name: common.replace(/\b\p{L}/gu, (c) => c.toUpperCase()),
      species: taxon.name,
      enclosureId:
        ENCLOSURE_BY_ICONIC[taxon.iconic_taxon_name ?? ''] ?? 'savanna',
      photoUrl: taxon.default_photo?.medium_url,
    };
    this.seen.set(animal.id, animal);
    return animal;
  }

  private toHealthRecord(animal: Animal, index: number): AnimalHealthRecord {
    const statuses: readonly HealthStatus[] = [
      'treatment',
      'observation',
      'healthy',
    ];
    return {
      id: `health-${animal.id}`,
      animalId: animal.id,
      checkedOn: new Date().toISOString().slice(0, 10),
      status: statuses[index % statuses.length],
      dueToday: index < 2,
    };
  }
}
