import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Incluimos ClientHydration para que el servidor pueda renderizar la aplicación
    provideClientHydration(),
    // Incluimos HttpClient para que la aplicación pueda hacer peticiones HTTP
    provideHttpClient()
  ]
};
