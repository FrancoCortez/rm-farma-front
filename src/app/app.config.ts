import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RootStoreModule } from './root-store';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuditorInterceptor } from './utils/interceptors/auditor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuditorInterceptor, multi: true },
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      RootStoreModule,
      SweetAlert2Module.forRoot(),
    ),
  ],
};
