export type Zone = 'savanna' | 'aviary' | 'aquarium' | 'reptile-house';

export interface Enclosure {
  readonly id: string;
  readonly name: string;
  readonly zone: Zone;
  readonly capacity: number;
}
