var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

// browser-sync
//______________________________________________

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    })
})

// gulp-sass
//______________________________________________

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('app/compiled_css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// gulp-useref
//______________________________________________

gulp.task('useref', function() {
    var assets = useref.assets();

    return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(gulpIf('*.css', minifyCSS()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

// copy fonts, images and favicon to dist folder
//______________________________________________

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('favicon', function() {
    return gulp.src(['app/*.ico', 'app/*.txt'])
    .pipe(gulp.dest('dist'))
});

// watch tasks
//______________________________________________

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/scripts/**/*.js', browserSync.reload);
    console.log('seal is watching you!');
});

gulp.task('build', ['sass', 'useref', 'images', 'fonts', 'favicon'], function() {
    console.log('seal has build your files in the dist folder');
});

gulp.task('default', ['watch']);
