import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from "src/environments/environment";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), FontAwesomeModule),
        provideHttpClient(withInterceptorsFromDi())
    ]
}