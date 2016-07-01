"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var angularfire2_1 = require('angularfire2');
var app_component_1 = require('./app.component');
platform_browser_dynamic_1.bootstrap(app_component_1.SpiceApp, [
    angularfire2_1.FIREBASE_PROVIDERS,
    angularfire2_1.defaultFirebase('https://amber-heat-8766.firebaseio.com'),
    angularfire2_1.firebaseAuthConfig({
        method: angularfire2_1.AuthMethods.Redirect,
        provider: angularfire2_1.AuthProviders.Google
    })
]);
