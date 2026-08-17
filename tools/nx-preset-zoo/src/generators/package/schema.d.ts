export type PackageKind = 'data-access' | 'ui' | 'util' | 'types';

export interface PackageGeneratorSchema {
  name: string;
  kind: PackageKind;
}
