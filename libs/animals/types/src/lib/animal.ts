export interface Animal {
  readonly id: string;
  readonly name: string;
  readonly species: string;
  readonly enclosureId: string;
}

export type HealthStatus = 'healthy' | 'observation' | 'treatment';

export interface AnimalHealthRecord {
  readonly id: string;
  readonly animalId: string;
  /** ISO date. */
  readonly checkedOn: string;
  readonly status: HealthStatus;
  readonly dueToday: boolean;
}
