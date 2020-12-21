const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const spritesmith = require('gulp.spritesmith')


// compress image
gulp.task('imagemin', function () {
  const image_data = gulp.src('src/template/images/origin/*.{png,jpg}')
    .pipe(imagemin())
  image_data.pipe(gulp.dest('src/template/images/sprites'))
})

// generate sprite.png and sprite.css
gulp.task('sprites', function () {
  const sprite_data = gulp.src('src/template/images/sprites/*.{png,jpg}')
    .pipe(spritesmith({
      imgName: 'template/images/sprites.png',
      imgPath: 'template/images/sprites.png',
      cssName: 'template/_sprites.scss'
    }))
  sprite_data.pipe(gulp.dest('src'))
})
