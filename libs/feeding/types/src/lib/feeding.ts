export interface FeedingSchedule {
  readonly id: string;
  readonly animalId: string;
  /** ISO time, e.g. "09:30". */
  readonly at: string;
  readonly food: string;
  /** A keeper closed this moment — absent/false means it is still pending. */
  readonly done?: boolean;
}
