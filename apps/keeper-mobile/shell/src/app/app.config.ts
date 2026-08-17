import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePhotoPicker } from '@zoo/shared/ui/common';
import { CameraPhotoPicker } from '@zoo/shared/ui/mobile';
import { provideZooI18n } from '@zoo/shared/i18n';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideZooI18n(),
    providePhotoPicker(CameraPhotoPicker),
  ],
};
