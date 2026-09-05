export type DomainLibKind =
  | 'data-access'
  | 'ui'
  | 'util'
  | 'types'
  | 'slice'
  | 'feature';

export interface DomainLibGeneratorSchema {
  domain: string;
  kind: DomainLibKind;
  name?: string;
}
