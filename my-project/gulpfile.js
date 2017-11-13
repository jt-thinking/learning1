var gulp    = require('gulp')
var gutil   = require("gulp-util");
var path    = require('path');
var replace = require('gulp-replace');

// webpack dev server
// var webpackDevServer = require('webpack-dev-server');
// webpack
var webpack = require('webpack')
// webpack 配置
var webpackConf = require("./webpack.config.js");
// 修改配置
var devConf = Object.create(webpackConf);

devConf.devtool = "sourcemap";

// 创建一个配置
var devCompiler = webpack(devConf);

gulp.task("webpack:build-dev", function(callback) {
    // 运行webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});


//移动文件到src
// move
gulp.task('move-src', function() {
    return gulp.src(
        [
            './node_modules/element-ui/lib/theme-default/index.css',
            './node_modules/element-ui/lib/theme-default/fonts/*',
            './node_modules/element-ui/lib/index.js',
            './node_modules/vue/dist/*',
            './node_modules/iview/dist/**/**/*',
            './node_modules/moment/locale//*',
            './node_modules/moment/min/*',
            './node_modules/font-awesome/css/*',
            './node_modules/font-awesome/fonts/*',
            './node_modules/accounting/*accounting*.js',
            './node_modules/vuex/dist/vuex.min.js',
        ], { //./node_modules/ivew/*
            base: './node_modules'   //如果设置为 base: 'js' 将只会复制 js目录下文件, 其他文件会忽略
        }
    ).pipe(gulp.dest('./src/lib/'));
});

//移动文件到src
// move
gulp.task('move-dist', function() {
    return gulp.src(
        [
            './node_modules/element-ui/lib/theme-default/index.css',
            './node_modules/element-ui/lib/theme-default/fonts/*',
            './node_modules/element-ui/lib/index.js',
            './node_modules/vue/dist/*',
            './node_modules/iview/dist/**/**/*',
            './node_modules/moment/locale//*',
            './node_modules/moment/min/*',
            './node_modules/font-awesome/css/*',
            './node_modules/font-awesome/fonts/*',
            './node_modules/accounting/*accounting*.js',
            './node_modules/vuex/dist/vuex.min.js',
        ], { //./node_modules/ivew/*
            base: './node_modules'   //如果设置为 base: 'js' 将只会复制 js目录下文件, 其他文件会忽略
        }
    ).pipe(gulp.dest('./dist/lib/'));
});

gulp.task('webpack:build-dist',['move-dist','webpack:build-dev'],function () {
    
})

gulp.task('rename-dist',function () {
    gulp.src(['./index.html'])
        .pipe(replace('./src', './dist'))
        .pipe(gulp.dest('./'));
})

gulp.task('rename-src',function () {
    gulp.src(['./index.html'])
        .pipe(replace('./dist', './src'))
        .pipe(gulp.dest('./'));
})

// 修改配置
// var serverConf = Object.create(webpackConf);
// serverConf.devtool = "eval";
//
// gulp.task("webpack-dev-server", function(callback) {
//     // 启动server
//     new webpackDevServer(webpack(serverConf), {
//         publicPath: "/" + serverConf.output.publicPath,
//         stats: {
//             colors: true
//         },
//         hot:true,
//     }).listen(8080, "localhost", function(err) {
//         if(err) throw new gutil.PluginError("webpack-dev-server", err);
//         gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
//     });
// });