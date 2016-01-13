/**
 * Created by Doma on 15/12/28.
 */
var gulp = require('gulp');

// 引入组件
var concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename');//文件更名

// 合并、压缩js文件
gulp.task('js', function () {
    return gulp.src([
            "js/InputManager.js",
            "js/Renderer.js",
            "js/Game.js"
        ])
        .pipe(concat('blockit.app.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('default', function () {
    // 监听html文件变化
    gulp.watch([
        "js/InputManager.js",
        "js/Renderer.js",
        "js/Game.js"
    ], ['js']);
});