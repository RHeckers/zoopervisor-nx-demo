export type SharedLibKind = 'data-access' | 'ui' | 'util' | 'types';

export interface SharedLibGeneratorSchema {
  kind: SharedLibKind;
  platform?: 'mobile' | 'desktop';
}
