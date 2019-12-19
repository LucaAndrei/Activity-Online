

// gulpfile.js
// Heavily inspired by Mike Valstar's solution:
//   http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/

/*
https://scotch.io/tutorials/a-quick-guide-to-using-livereload-with-gulp
https://scotch.io/tutorials/getting-started-with-browserify#toc-why-browserify-
http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/
https://gist.github.com/mattidupre/96f998ff685c8354e8b3

*/
"use strict";

var browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    watchify = require('watchify'),
    gutil = require('gulp-util'), // needs to be updated. package is deprecated
    maps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');


var config = {
    main: {
        src: 'src/**/*',
        outputDir: './src/dist/**/*'
    },
    js: {
        src: './src/js/main.js',       // Entry point
        outputDir: './src/dist/build/',  // Directory to save bundle to
        outputFile: 'bundle.js' // Name to use for bundle
    },
    scss: {
        src: 'src/scss/styles.scss',
        outputDir: './src/dist/css'
    }
};

// This method makes it easy to use common bundling options in different tasks
function bundleJS() {
    // Add options to add to "base" bundler passed as parameter
    return browserify(config.js.src)
        .bundle()                                                        // Start bundle
        .pipe(source(config.js.src))                        // Entry point
        .pipe(buffer())                                               // Convert to gulp pipeline
        .pipe(rename(config.js.outputFile))          // Rename output from 'main.js' to 'bundle.js'
        .pipe(gulp.dest(config.js.outputDir));        // Save 'bundle' to build/
}

function bundleCSS() {
    return gulp.src(config.scss.src).pipe(sass()).pipe(gulp.dest(config.scss.outputDir))
}
function styles() {
    gutil.log(gutil.colors.green('Compiling styles...'));
    // Use gulp-concat-css to include vanilla CSS

    return gulp.src(config.scss.src)
        .pipe(maps.init())
        .pipe(sass({ errLogToConsole: true, }))
        .on('error', gutil.beep)
        .pipe(maps.write())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(config.scss.outputDir));
}

function scripts() {
    var bundler = watchify(browserify(config.js.src, { debug: true }));

    var rebundle = function () {
        gutil.log(gutil.colors.green('Bundling scripts...'));
        return bundler.bundle()
            .on('error', function (e) {
                gutil.beep();
                gutil.log(gutil.colors.red('Error (Browserify): ' + e.message));
            })
            .pipe(source(config.js.src))
            .pipe(buffer())
            .pipe(maps.init({ loadMaps: true }))
            .pipe(rename(config.js.outputFile))          // Rename output from 'main.js' to 'bundle.js'
            .pipe(gulp.dest(config.js.outputDir));        // Save 'bundle' to build/
    };

    bundler.on('update', function () {
        return rebundle();
    });

    return rebundle();
}


gulp.task('bundle', function () {
    bundleJS();  // Chain other options -- sourcemaps, rename, etc.
    return bundleCSS();

})

gulp.task('watch', function () {
    watch(config.scss.src, styles);
    scripts();
    // Watch destination files and reload
    livereload({start: true});
    // livereload.listen();
    watch(config.main.outputDir, livereload.changed);



    // return gulp.watch(config.main.src, gulp.series('bundle'));
    // // return gulp.bun
    // var bundler = browserify(config.js.src);
    // bundle(bundler);  // Chain other options -- sourcemaps, rename, etc.
});

exports.w = gulp.series('bundle', 'watch')