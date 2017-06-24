var gulp = require('gulp'),
pump = require('pump'),
rollup2 = require('rollup'),
connect = require('gulp-connect');


gulp.task('dev', ['bundle']);

gulp.task('watch-dev', function (callBack) {
    
    console.log("Service Başlıyor");
    connect.server({
        livereload: true,
        root:'./',
        port:8080,
    });

    console.log("Bundle Başlıyor");
    gulp.watch(['./src/js/*.js', './src/js/*/*.js'], ['bundle' ,'reload']);
    gulp.watch('./development/*.html', ['reload']);
});


gulp.task('reload', function (callBack) {
    
    pump([
            gulp.src('./src/js/*.js'),
            connect.reload()
        ],callBack);

    console.log("reload oldu");
    
});



gulp.task('bundle', function (callBack) {

console.log("bundle started");
    return rollup2.rollup({
            entry : './src/js/Bagcilar2D.js'
        }).then(function (bundle) {
 
             bundle.write({
                indent : '\t',
                format : 'umd',
                dest : 'build/Bagcilar2d.js',
                moduleName : 'Bagcilar'
             });

        });
});
