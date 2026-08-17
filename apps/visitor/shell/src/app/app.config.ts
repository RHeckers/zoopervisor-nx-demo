import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePhotoPicker } from '@zoo/shared/ui/common';
import { FileInputPhotoPicker } from '@zoo/shared/ui/desktop';
import { provideZooI18n } from '@zoo/shared/i18n';
import { PaymentProvider } from '@zoo/tickets/data-access';
import { appRoutes } from './app.routes';
import { OnlinePayment } from './online-payment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideZooI18n(),
    providePhotoPicker(FileInputPhotoPicker),
    // This app binds the abstract PaymentProvider token to its web impl.
    { provide: PaymentProvider, useClass: OnlinePayment },
  ],
};
