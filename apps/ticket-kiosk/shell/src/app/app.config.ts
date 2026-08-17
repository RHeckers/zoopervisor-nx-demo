import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZooI18n } from '@zoo/shared/i18n';
import { PaymentProvider } from '@zoo/tickets/data-access';
import { appRoutes } from './app.routes';
import { TerminalPayment } from './terminal-payment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideZooI18n(),
    // Same token, different concrete provider than visitor.
    { provide: PaymentProvider, useClass: TerminalPayment },
  ],
};
