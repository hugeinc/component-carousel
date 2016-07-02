var gulp			= require('gulp');
var del				= require('del');
var browserify= require('browserify');
var babel			= require('babelify');
var source		= require('vinyl-source-stream');
var buffer		= require('vinyl-buffer');
var uglify		= require('gulp-uglify');
var jshint		= require('gulp-jshint');
var rename		= require('gulp-rename');
var connect		= require('gulp-connect');
var karma			= require('karma');

var PATHS = {
	css: ['src/*.css'],
	js: ['src/*.es6.js']
};

var JSHINTRC = {
	"sub"			: true,
	"strict"		: true,
	"globalstrict"	: true,
	"validthis"		: true,
	"trailing"		: true,
	"white"			: true,
	"browser"		: true,
	"curly"			: true,
	"eqnull"		: true,
	"eqeqeq"		: true,
	"loopfunc"	: true,
	"indent"		: 4,
	globals: {
		console: false
	}
};

var KARMACONF = {
	singleRun: true,
	browsers: ['PhantomJS'],
	frameworks: ['browserify', 'jasmine'],
	browserify: {
		debug: true,
		transform: ['babelify']
	},
	preprocessors: {
		'src/**/*.js': ['browserify'],
		'test/**/*.js': ['browserify']
	},
	files: [
		'src/**/*.js',
		'test/**/*.spec.js'
	]
};

gulp.task('dist', function() {
	var bundler = browserify('src/shim.js', { debug: true }).transform(babel);

	return bundler.bundle()
		.pipe(source('flexicarousel.min.js'))
		.pipe(buffer())
		.pipe(jshint(JSHINTRC))		// TODO eslint?
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
	return gulp.src(PATHS.js)
		.pipe(jshint(JSHINTRC))
});

gulp.task('karma', function() {
	 new karma.Server(KARMACONF).start();
});

gulp.task('clean', function() {
	return del([
		'dist/*.js',
	]);
});

gulp.task('connect', function() {
	connect.server({
		port: 8003
	});
});


/* ---------------------------------------
	Stuffs
 -----------------------------------------*/

gulp.task('default', ['build', 'connect']);
gulp.task('build', ['clean', 'dist']);
gulp.task('test', ['lint', 'karma']);
