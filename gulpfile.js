var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

var paths = {
    styles: {
        src: "src/styles/**/*.scss",

        dest: "build/css"
    },

    html: {
        src: "build/*.html"
    }
};

function reload() {
    browserSync.reload();
}

function style() {
    return gulp.src(paths.styles.src)
        // Initialise sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using css nano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browserSync stream pipe after compilation
        .pipe(browserSync.stream());
}

// Add browserSync initialisation at the start of the watch task
function watch() {
    browserSync.init({
        // Tell browser to use thos directory and serve it as a mini-server
        server: {
            baseDir: "./build"
        }
    });

    style();

    gulp.watch(paths.styles.src, style);

    // Tell gulp which files to watch to trigger the reload
    // This can be html or whatever  you're using to develop your website
    gulp.watch(paths.html.src).on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;

var build = gulp.parallel(style, watch);

// gulp.task('build', build);

gulp.task('default', build);