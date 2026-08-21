import { Routes } from '@angular/router';
import { EnclosureDetailComponent } from './enclosure-detail.component';
import { EnclosureMapComponent } from './enclosure-map.component';

/**
 * This feature owns TWO routed views, so it exposes a routes file and the
 * shell mounts it with `loadChildren`. Single-view features skip this file —
 * the shell loads their component directly.
 */
export const enclosureMapRoutes: Routes = [
  { path: '', component: EnclosureMapComponent },
  { path: ':enclosureId', component: EnclosureDetailComponent },
];
