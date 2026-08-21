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
      import('@zoo/ticket-kiosk/features/buy-tickets').then(
        (m) => m.BuyTicketsComponent,
      ),
  },
  {
    path: 'info',
    loadComponent: () =>
      import('@zoo/ticket-kiosk/features/park-info').then(
        (m) => m.ParkInfoComponent,
      ),
  },
];
