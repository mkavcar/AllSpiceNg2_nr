(function (global) {
    var map = {
        app: 'dist',
        '@angular': 'node_modules/@angular',
        rxjs: 'node_modules/rxjs',
        firebase: 'node_modules/firebase/lib/firebase-web.js',
        angularfire2: 'node_modules/angularfire2',
        jquery: 'https://code.jquery.com/jquery.min.js'
    };
    var packages = {
         'app': { main: 'main.js', defaultExtension: 'js' },
         'rxjs': { defaultExtension: 'js' },
         'angularfire2': { main: 'angularfire2.js', defaultExtension: 'js' }
    };

    var packageNames = [
         '@angular/common',
         '@angular/compiler',
         '@angular/core',
         '@angular/platform-browser',
         '@angular/platform-browser-dynamic'
    ];
  packageNames.forEach(function (pkgName) {
     packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
     map: map,
     packages: packages
  }

   if (global.filterSystemConfig) { global.filterSystemConfig(config); }
   System.config(config);

 })(this);