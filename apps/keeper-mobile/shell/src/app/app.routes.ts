import { Routes } from '@angular/router';

/**
 * The shell owns routing and lazy-loads the app's features. Both features are
 * single-view, so they are loaded straight by component — no per-feature
 * routes file needed.
 */
export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@zoo/keeper-mobile/features/animal-detail').then(
        (m) => m.AnimalDetailComponent,
      ),
  },
  {
    path: 'rounds',
    loadComponent: () =>
      import('@zoo/keeper-mobile/features/feeding-rounds').then(
        (m) => m.FeedingRoundsComponent,
      ),
  },
];
