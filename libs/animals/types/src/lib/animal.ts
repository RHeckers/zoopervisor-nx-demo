export interface Animal {
  readonly id: string;
  readonly name: string;
  readonly species: string;
  readonly enclosureId: string;
  /** Absent for animals without a picture — consumers fall back to initials. */
  readonly photoUrl?: string;
}

/** One page of a (possibly huge) animal listing. */
export interface AnimalPage {
  readonly items: Animal[];
  /** Total matches across ALL pages, not just this one. */
  readonly total: number;
  readonly page: number;
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
