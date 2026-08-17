import { Routes } from '@angular/router';

/** The shell owns routing and lazy-loads the app's features. */
export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@zoo/keeper-mobile/features/animal-detail').then(
        (m) => m.animalDetailRoutes,
      ),
  },
];
