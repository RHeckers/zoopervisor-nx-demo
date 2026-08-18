import { Routes } from '@angular/router';

/** The shell owns routing and lazy-loads the app's features. */
export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@zoo/ticket-kiosk/features/buy-tickets').then(
        (m) => m.buyTicketsRoutes,
      ),
  },
  {
    path: 'info',
    loadChildren: () =>
      import('@zoo/ticket-kiosk/features/park-info').then(
        (m) => m.parkInfoRoutes,
      ),
  },
];
