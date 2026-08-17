import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePhotoPicker } from '@zoo/shared/ui/photo-picker';
import { CameraPhotoPicker } from '@zoo/keeper-mobile/ui/photo-picker';
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
