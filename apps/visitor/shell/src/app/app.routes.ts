import { Routes } from '@angular/router';

/**
 * The shell owns routing and lazy-loads the app's features. A feature with a
 * single view is loaded straight by component; only a feature with internal
 * routing (enclosure-map: map + detail) exposes a routes file.
 */
export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@zoo/visitor/features/animal-list').then(
        (m) => m.AnimalListComponent,
      ),
  },
  {
    path: 'enclosures',
    loadChildren: () =>
      import('@zoo/visitor/features/enclosure-map').then(
        (m) => m.enclosureMapRoutes,
      ),
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import('@zoo/visitor/features/tickets').then((m) => m.TicketsComponent),
  },
];
