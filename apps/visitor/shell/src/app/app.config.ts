import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestUtilA } from '@zoopervisor/utils';
import { appRoutes } from './app.routes';
import { CameraPhotoPicker, FileInputPhotoPicker, providePhotoPicker } from '@zoopervisor/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAppInitializer(() => {
      const value = TestUtilA.sayHello();
      console.log('App initialized', value);
    }),
    providePhotoPicker(FileInputPhotoPicker)
  ],
};
