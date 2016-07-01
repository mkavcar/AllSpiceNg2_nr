import { bootstrap } from '@angular/platform-browser-dynamic';
import { FIREBASE_PROVIDERS, defaultFirebase, firebaseAuthConfig, AuthMethods, AuthProviders } from 'angularfire2';

import { SpiceApp } from './app.component';

bootstrap(SpiceApp, [
    FIREBASE_PROVIDERS,
    defaultFirebase('https://amber-heat-8766.firebaseio.com'),
    firebaseAuthConfig({
        method: AuthMethods.Redirect,
        provider: AuthProviders.Google
    })
  ]);