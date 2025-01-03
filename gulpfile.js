const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const mode = require('gulp-mode')({
	modes: ['production', 'development'],
	default: 'development',
	verbose: false
});
const clean = require('gulp-clean');

async function getAutoPrefixer() {
	const module = await import('gulp-autoprefixer');
	return module.default;
}

const paths = {
	styles: {
		src: 'src/scss/**/*.scss',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/js/**/*.js',
		dest: 'dist/js/'
	}
}

// clean CSS files in dist folder
function cleanCSSFiles() {
	return gulp.src(paths.styles.dest, { read: false, allowEmpty: true }).pipe(clean());
}

// clean JS files in dist folder
function cleanJSFiles() {
	return gulp.src(paths.scripts.dest, { read: false, allowEmpty: true }).pipe(clean());
}

// Compile SCSS to CSS, add sourcemaps, autoprefix, and minify
async function styles() {
	const autoprefixer = await getAutoPrefixer();
	return gulp.src(paths.styles.src)
		.pipe(mode.development(sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(mode.production(cleanCSS()))
		.pipe(mode.development(sourcemaps.write('.')))
		.pipe(gulp.dest(paths.styles.dest));
}

// Minify JS files
function scripts() {
	return gulp.src(paths.scripts.src)
		.pipe(mode.development(sourcemaps.init()))
		.pipe(mode.production(uglify()))
		.pipe(mode.development(sourcemaps.write('.')))
		.pipe(gulp.dest(paths.scripts.dest));
}

// Watch files for changes
function watch() {
	gulp.watch(paths.styles.src, gulp.series(cleanCSSFiles, styles));
	gulp.watch(paths.scripts.src, gulp.series(cleanJSFiles, scripts));
}

// Define complex tasks
const build = gulp.series(gulp.parallel(cleanCSSFiles, cleanJSFiles), gulp.parallel(styles, scripts));
const dev = gulp.series(build, watch);

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = dev;
