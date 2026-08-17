export type DomainLibKind = 'data-access' | 'ui' | 'util' | 'types' | 'slice';

export interface DomainLibGeneratorSchema {
  domain: string;
  kind: DomainLibKind;
}
