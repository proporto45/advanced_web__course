const gulp = require('gulp'),
  pug = require('gulp-pug'),
  fs = require('fs'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  sassGlob = require('gulp-sass-glob'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  spritesmith = require('gulp.spritesmith'),
  csso = require('gulp-csso');



  const SRC_DIR = './src/';
  const DIST_DIR = './dist/';

  const path = {
    sass: {
      entry: SRC_DIR + 'styles/main.scss',
      src: SRC_DIR + 'styles/**/*.scss',
      dist: DIST_DIR + 'css'
    },
    pug: {
      src_views: SRC_DIR + 'views/pages/**/*.pug',
      src: SRC_DIR + '**/*.pug',
      dist: DIST_DIR
    },
    sprite: {
      src: SRC_DIR + 'img/icons/*.png',
      distImg: DIST_DIR + 'img',
      imgLocation: '../img/sprite.png',
      distFile: SRC_DIR + 'styles/sprite'
    }
  }

// server
gulp.task('server', () => {
  browserSync.init({
    open: false,
    notify: false,
    server: {
      baseDir: DIST_DIR
    }
  });
});

gulp.task('pug', () => {
  // let locals = require('./content.json');

  gulp.src(path.pug.src_views).pipe(plumber()).pipe(pug({
    locals: JSON.parse(fs.readFileSync('content.json', 'utf8')),
    // locals : locals,
    pretty: true
  })).pipe(gulp.dest(path.pug.dist)).pipe(reload({stream: true}));
});

gulp.task('sprite', () => {
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

gulp.task('sass', () => {
  return gulp.src(path.sass.entry)
  .pipe(sourcemaps.init())
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
        .pipe(csso())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.sass.dist));
});


gulp.task('watch', () => {
  gulp.watch(path.pug.src, ['pug']);
  gulp.watch(path.sass.src, ['sass'])
});

gulp.task('default', ['pug', 'sass', 'server', 'watch']);
