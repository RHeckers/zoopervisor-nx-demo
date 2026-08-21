import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ANIMAL_API, InatAnimalApi } from '@zoo/animals/data-access';
import { providePhotoPicker } from '@zoo/shared/ui/common';
import { FileInputPhotoPicker } from '@zoo/shared/ui/desktop';
import { provideZooI18n } from '@zoo/shared/i18n';
import { PaymentProvider } from '@zoo/tickets/data-access';
import { appRoutes } from './app.routes';
import { OnlinePayment } from './online-payment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Input binding lets enclosure-detail take `:enclosureId` as a signal input.
    provideRouter(appRoutes, withComponentInputBinding()),
    provideZooI18n(),
    providePhotoPicker(FileInputPhotoPicker),
    // This app binds the abstract PaymentProvider token to its web impl.
    { provide: PaymentProvider, useClass: OnlinePayment },
    // …and swaps the fake AnimalApi for the live iNaturalist adapter. One
    // provider line — no store, facade or component knows the transport changed.
    { provide: ANIMAL_API, useClass: InatAnimalApi },
  ],
};
