import { AppLibKind } from '../../lib/add-app-lib';

export interface AppLibGeneratorSchema {
  app: string;
  kind: AppLibKind;
  /** Required when kind is `feature`. */
  name?: string;
}
