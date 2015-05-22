var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var taskListing  = require('gulp-task-listing');
var sourcemaps   = require('gulp-sourcemaps');
var publish      = require('./publish.json');

var config = {
    sass: {
        base: 'app/assets/sass/*.scss',
        compiled: 'public/css/',
        outputStyle: 'nested',
    },

    bs: {
        proxy: 'localhost:8000',
        browsers: ['google chrome'] // firefox, safari
    },
    
    blade: '**/*.blade.php',
    js: 'public/js/**/*.js',
    watchers: ['compile-sass', 'watch-blade', 'watch-css', 'watch-js', 'watch-sass'],
    compilers: ['compile-sass'],
}

// List tasks as default task
gulp.task('default', taskListing);

// Watchers
gulp.task('watch', config.watchers, function(){
    browserSync({
        proxy: config.bs.proxy,
        browser: config.bs.browsers,
        ghostMode: {
            clicks: true,
            location: true,
            forms: true,
            scroll: true
        }
    });
});
gulp.task('watch-blade', function(){
    gulp.watch(config.blade, ['reload']);
});
gulp.task('watch-css', function(){
    gulp.watch(config.sass.compiled + '*.css', function(){
        gulp.src(config.sass.compiled + '*.css')
            .pipe(reload({ stream: true }));
    });
});
gulp.task('watch-js', function(){
    gulp.watch(config.js, function(){
        gulp.src(config.js)
            .pipe(reload({ stream: true }));
    });
});
gulp.task('watch-sass', function(){
    gulp.watch(config.sass.base, ['compile-sass']);
});

// Compilers
gulp.task('compile', config.compilers);
gulp.task('compile-sass', function(){
    gulp.src(config.sass.base)
        .pipe(sourcemaps.init())
        .pipe(sass({ errLogToConsole: true, outputStyle: config.sass.outputStyle }))
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ff 17', 'opera 12.1'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.sass.compiled));
});

// Reloaders
// Easy task to send a browsersync livereload
gulp.task('reload', function(){
    gulp.src('.')
        .pipe(reload({ stream: true }));
});

gulp.task('publish', function(){
  publish.files.forEach(function(file){
    gulp.src(file.src)
      .pipe(gulp.dest(file.dest));
  });
});
