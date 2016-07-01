var gulp = require("gulp"),
    concat = require("gulp-concat"),
    tsc = require("gulp-typescript"),
    jsMinify = require("gulp-uglify"),
    del = require("del"),
    merge = require("merge-stream"),
    SystemBuilder = require("systemjs-builder");

var appFolder = "./src";
var outFolder = "prod";

gulp.task("clean", () => {
    return del(outFolder);
});

gulp.task("shims", () => {
    return gulp.src([
            "node_modules/es6-shim/es6-shim.js",
            "node_modules/zone.js/dist/zone.js",
            "node_modules/reflect-metadata/Reflect.js"
    ])
    .pipe(concat("shims.js"))
    .pipe(jsMinify())
    .pipe(gulp.dest(outFolder + "/js/"));
});

gulp.task("tsc", () => {
    var tsProject = tsc.createProject("./tsconfig.json");
    var tsResult = gulp.src([
        "typings/browser.d.ts",
        appFolder + "/main.ts",
        appFolder + "/app.component.ts",
        appFolder + "/**/*.ts"
    ])
    .pipe(tsc(tsProject), undefined, tsc.reporter.fullReporter());

    return tsResult.js.pipe(gulp.dest("build/"));
});

gulp.task("system-build", ["tsc"], () => {
    var builder = new SystemBuilder();

    return builder.loadConfig("systemjs.config.js")
        .then(() => builder.buildStatic("dist", outFolder + "/js/bundle.js"))
        .then(() => del("build"));
});

gulp.task("buildAndMinify", ["system-build"], () => {
    return bundle = gulp.src(outFolder + "/js/bundle.js")
        .pipe(jsMinify())
        .pipe(gulp.dest(outFolder + "/js/"));
});


gulp.task("default", [
    "shims",
    "buildAndMinify"//,
    //"assets",
    //"otherScriptsAndStyles"
    //,"watch"
]);