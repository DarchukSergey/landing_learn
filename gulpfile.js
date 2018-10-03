const gulp 			=	require('gulp');
const browserSync 	= 	require('browser-sync').create();
const reload      	= 	browserSync.reload;
const pug 		    =	require('gulp-pug');
const sass          =   require('gulp-sass');
const spritesmith   =   require('gulp.spritesmith');
const rimraf        =   require('rimraf');
const rename		=   require('gulp-rename');
const autoprefixer  =   require('gulp-autoprefixer');
const sourcemaps    =   require('gulp-sourcemaps');


const paths = {
	styles: {
		sass: ['./source/sass/**/*.sass','./source/sass/*.scss'],
		dest: './build/css/'
	}
};

bs_ops = { stream: true };

gulp.task('server',function(){
	browserSync.init({
		server: { 
			port:9000, 
			baseDir:"./build/"
		}
	}
	)
});

/*---------------------------PUG----------------------------------*/ 


gulp.task('templates:compile', function buildHTML() {
	return gulp.src('source/template/index.pug')
		.pipe(pug({
			 pretty:true
		 }))
		.pipe(gulp.dest('./build/'))
		.pipe(browserSync.reload({stream: true}));
}); 


 /*------------------------Sprite----------------------------------------*/ 
gulp.task('sprite', function (cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.img.pipe(gulp.dest('source/styles/global'));
  cb();
});

gulp.task('styles', function(){
	return gulp.src(paths.styles.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({
				outputStyle:'compressed'
			}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
	        }))
		.pipe(rename('main.min.css'))
		.pipe(sourcemaps.write('./maps'))
	    .pipe(gulp.dest(paths.styles.dest))
	    .pipe(reload(bs_ops));
});


/*----------------------Delete------------------------------------------*/ 
gulp.task('clean', function del(cb) {
	return rimraf('build', cb);
})
 

/*----------------------Copy fonts------------------------------------*/
gulp.task('copy:fonts',function(){
	return gulp.src('./source/fonts/**/*.*')
	.pipe(gulp.dest('build/fonts'));
});



/*-------------------Copy images-------------------------------------*/
gulp.task('copy:images',function(){
	return gulp.src('./source/images/**/*.*')
	.pipe(gulp.dest('build/images'));
});

/*------------------Copy----------------------------------*/ 
gulp.task('copy', gulp.parallel('copy:fonts','copy:images'));

gulp.task('watch',function(){
	gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
	gulp.watch(paths.styles.sass, gulp.series('styles')); 
});

 gulp.task('default', gulp.series(
 	'clean',
 	gulp.parallel('templates:compile', 'styles', 'sprite', 'copy'),
 	gulp.parallel('watch','server')
 ));