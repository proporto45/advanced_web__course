var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var spritesmith = require('gulp.spritesmith');

var SRC_DIR = './src/';
var DIST_DIR = './dist/';

var path = {
  sass: {
    entry: SRC_DIR + 'styles/main.scss',
    src: SRC_DIR + 'styles/**/*.scss',
    dist: DIST_DIR + 'css'
  },
  sprite: {
    src: SRC_DIR + 'img/icons/*.png',
    distImg: DIST_DIR + 'img',
    imgLocation: '../img/sprite.png',
    distFile: SRC_DIR + 'styles/sprite'
  }
}

gulp.task('sprite', function () {
  var spriteData = gulp.src(path.sprite.src)
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    cssFormat: 'css',
    imgPath: path.sprite.imgLocation,
    padding: 70
  }));
  spriteData.img.pipe(gulp.dest(path.sprite.distImg));
  spriteData.css.pipe(gulp.dest(path.sprite.distFile));
});

gulp.task('sass', function() {
  return gulp.src(path.sass.entry)
  .pipe(sourcemaps.init())
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.sass.dist));
});



gulp.task('watch', function() {
  gulp.watch(path.sass.src, ['sass'])
})

gulp.task('default', ['sass', 'watch']);
