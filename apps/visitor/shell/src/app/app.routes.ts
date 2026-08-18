import { Routes } from '@angular/router';

/** The shell owns routing and lazy-loads the app's features. */
export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@zoo/visitor/features/animal-list').then((m) => m.animalListRoutes),
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
    loadChildren: () =>
      import('@zoo/visitor/features/tickets').then((m) => m.ticketsRoutes),
  },
];
