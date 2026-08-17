export interface FeedingSchedule {
  readonly id: string;
  readonly animalId: string;
  /** ISO time, e.g. "09:30". */
  readonly at: string;
  readonly food: string;
}
