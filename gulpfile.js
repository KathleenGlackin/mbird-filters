const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// Compile SCSS into CSS and minify
function styles() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/css'));
}

// Minify and concatenate JS files
function scripts() {
	return gulp.src('src/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'));
}

// Watch files for changes
function watchFiles() {
	gulp.watch('src/scss/**/*.scss', styles);
	gulp.watch('src/js/**/*.js', scripts);
}

// Define complex tasks
const build = gulp.series(gulp.parallel(styles, scripts));
const watch = gulp.series(build, gulp.parallel(watchFiles));

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = build;
