import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { PaymentProvider } from '@zoo/tickets/data-access';
import { appRoutes } from './app.routes';
import { OnlinePayment } from './online-payment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    // This app binds the abstract PaymentProvider token to its web impl.
    { provide: PaymentProvider, useClass: OnlinePayment },
  ],
};
