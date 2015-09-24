var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();
var del = require('del');
// set variable via $ gulp --type production

var webpackConfig = require('./webpack.config.js');
// Openfin specific
var openfinConfigBuilder = require('openfin-config-builder');
var openfinLauncher = require('openfin-launcher');

var port =  1337;
var app = 'app/';
var dist = 'dist/';


gulp.task('scripts', function() {
    return gulp.src('./app/js/**/*.js')
        .pipe($.webpack(webpackConfig))
        .pipe(gulp.dest(dist + 'js/'))
        //.pipe($.size({ title : 'js' }))
        //.pipe($.connect.reload());
});


// copy html from app to dist
gulp.task('html', function() {
    return gulp.src(app + '*.html')
        .pipe(gulp.dest(dist))
});



// copy bowercomponents from app to dist
gulp.task('vendor', function() {
    return gulp.src([app  + 'js/jet-1.8.0/*'])
        .pipe(gulp.dest(dist+"js/jet-1.8.0"))
});

// copy app.json so it is available to the launcher from the dist directory.
gulp.task('app_json', function() {
    return gulp.src(app + 'app.json')
        .pipe(gulp.dest(dist))
});

gulp.task('styles',function(cb) {

    // convert stylus to css
    return gulp.src(app + 'stylus/main.styl')
        .pipe($.stylus({
            // only compress if we are in production
            compress: isProduction,
            // include 'normal' css into main.css
            'include css' : true
        }))
        .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
        .pipe(gulp.dest(dist + 'css/'))
        .pipe($.size({ title : 'css' }))
        .pipe($.connect.reload());

});


// add livereload on the given port
gulp.task('serve', function() {
    $.connect.server({
        root: dist,
        port: port,
        livereload: {
            port: 35729
        }
    });
});

// copy images
gulp.task('images', function(cb) {
    return gulp.src(app + 'images/**/*.{png,jpg,jpeg,gif}')
        .pipe($.size({ title : 'images' }))
        .pipe(gulp.dest(dist + 'images/'));
});

// watch styl, html and js file changes
gulp.task('watch', function() {
    //gulp.watch(app + 'stylus/*.styl', ['styles']);
    gulp.watch(app + 'index.html', ['html']);
    gulp.watch(app + 'scripts/**/*.js', ['scripts']);
    //gulp.watch(app + 'scripts/**/*.jsx', ['scripts']);
});

// remove bundels
gulp.task('clean', function(cb) {
    del([dist], cb);
});

// OpenFin

function createConfig() {
    return openfinConfigBuilder.create({
        startup_app: {
            name: 'EikonApp2',
            url: 'https://bam-poc-2.herokuapp.com/#/info -- this is not active yet'
        }
    }, 'app.json');
}

function updateConfig() {
    return openfinConfigBuilder.update({
        startup_app: {
            name: 'EikonApp2'
        }
    }, 'app.json');
}

function launchOpenfin () {
    return openfinLauncher.launchOpenFin({
        configPath: 'file:/' + path.resolve('dist/app.json')
    });
}

gulp.task('openfin', function() {
    return launchOpenfin()
    //.then(updateConfig)
    //.then(launchOpenfin);
});


// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['app_json', 'html','scripts', 'vendor', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
    gulp.start(['app_json', 'html','scripts', 'vendor']);
});

