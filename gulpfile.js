/*
 * @Author: huixie 
 * @Date: 2017-07-11 14:36:38 
 * @Last Modified by: huixie
 * @Last Modified time: 2017-07-14 15:05:54
 */
var gulp = require('gulp')
var gutil = require('gulp-util')
var uglify = require('gulp-uglify')//压缩js
var watchPath = require('gulp-watch-path')//只编写当前修改的 js 文件
var combiner = require('stream-combiner2')// 捕获错误信息,而且不会让 gulp 停止运行。
var sourcemaps = require('gulp-sourcemaps')//压缩后的代码不存在换行符和空白符，使用 sourcemap 帮助调试
var minifycss = require('gulp-minify-css')//压缩 CSS 
var autoprefixer=require('gulp-autoprefixer')//autoprefixer 解析 CSS 文件并且添加浏览器前缀到CSS规则里。
var imagemin = require('gulp-imagemin')
var less = require('gulp-less')

/*让命令行输出的文字带颜色*/
// gulp.task('default', function () {
//     gutil.log('message')
//     gutil.log(gutil.colors.red('error'))
//     gutil.log(gutil.colors.green('message:') + "some")
// })

/*配置js*/
var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}
gulp.task('watchjs', function () {
    gulp.watch('origin/js/**/*.js', function (event) {
      var paths = watchPath(event, 'origin/js', 'app/js')
      gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
      gutil.log('App ' + paths.distPath)
      var combined = combiner.obj([
        gulp.src(paths.srcPath),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest(paths.distDir)
      ])
      combined.on('error', handleError)// 捕获错误信息。
    })
})

//编译所有js 文件
gulp.task('uglifyjs', function () {
  var combined = combiner.obj([
    gulp.src('origin/js/**/*.js'),
    sourcemaps.init(),
    uglify(),
    sourcemaps.write('./'),
    gulp.dest('app/js/')
  ])
  combined.on('error', handleError)
})

/*配置 CSS 任务*/
gulp.task('watchcss', function () {
  gulp.watch('origin/css/**/*.css', function (event) {
    var paths = watchPath(event, 'origin/css', 'app/css')
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('App ' + paths.distPath)
    gulp.src(paths.srcPath)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({browsers: 'last 2 versions'}))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.distDir))
  })
})

/*编译所有css*/
gulp.task('minifycss', function () {
  gulp.src('origin/css/**/*.css')
  .pipe(sourcemaps.init())
  .pipe(autoprefixer({browsers: 'last 2 versions'}))
  .pipe(minifycss())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('app/css/'))
})

/*配置less*/
gulp.task('watchless', function () {
  gulp.watch('origin/less/**/*.less', function (event) {
    var paths = watchPath(event, 'origin/less/', 'app/css/')
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('App ' + paths.distPath)
    var combined = combiner.obj([
      gulp.src(paths.srcPath),
      sourcemaps.init(),
      autoprefixer({browsers: 'last 2 versions'}),
      less(),
      minifycss(),
      sourcemaps.write('./'),
      gulp.dest(paths.distDir)
    ])
    combined.on('error', handleError)
  })
})

gulp.task('lesscss', function () {
  var combined = combiner.obj([
    gulp.src('origin/less/**/*.less'),
    sourcemaps.init(),
    autoprefixer({
      browsers: 'last 2 versions'
    }),
    less(),
    minifycss(),
    sourcemaps.write('./'),
    gulp.dest('app/css/')
  ])
  combined.on('error', handleError)
})


/*配置image*/
gulp.task('watchimage', function () {
  gulp.watch('origin/images/**/*', function (event) {
    var paths = watchPath(event,'origin/','app/')
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('App ' + paths.distPath)
    gulp.src(paths.srcPath)
    .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest(paths.distDir))
  })
})
//编译所有image
gulp.task('image', function () {
  gulp.src('origin/images/**/*')
  .pipe(imagemin({progressive: true}))
  .pipe(gulp.dest('app/images'))
})


gulp.task('default', ['watchjs',  'watchless', 'watchimage'])