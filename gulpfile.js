var gulp = require('gulp'),
    // 加载gulp-load-plugins插件，并马上运行它
    // 自动加载 package.json中的依赖库
    // usage: less() -> plugins.less()
    plugins = require('gulp-load-plugins')();


var srcJsPath = ['./src/*.js'],
	demoJsPath = ['./demo/*.js', '!./demo/*.babel.js', '!./demo/*.min.js'];

// src -> babel -> dist
gulp.task("srcJs", function () {
    gulp.src(srcJsPath)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel({
            presets: ['es2015'] // es6 -> es5
        })) 
        .pipe(plugins.rename({ suffix: '.babel' }))
        .pipe(gulp.dest('dist/'))
        .pipe(plugins.rename({ suffix: '.min' })) //         
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write("."))        // 输出sourcemaps        
        .pipe(gulp.dest('dist/'))       // 目标路径       
});


// demo -> babel 
gulp.task("demoJs", function () {
    gulp.src(demoJsPath)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel({
            presets: ['es2015'] // es6 -> es5
        })) 
        .pipe(plugins.rename({ suffix: '.babel' }))
        .pipe(gulp.dest(function (r) {
            return r.base;
        }))  
        .pipe(plugins.rename({ suffix: '.min' })) //         
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write("."))        // 输出sourcemaps
        .pipe(gulp.dest(function (r) {
            return r.base;
        }))      
});

gulp.task('default', function () {  
    gulp.watch(srcJsPath, ['srcJs']);
    gulp.watch(demoJsPath, ['demoJs']);   
});