const gulp 			=	require('gulp'),
	  browserSync 	= 	require('browser-sync').create(),
	  pug 		    =	require('gulp-pug');

	  gulp.task('server',function(){
	  	browserSync.init({
	  		server: {
	  			port:9000,
	  			baseDir:"build"
	  		}
	  	});

	  

	  gulp.watch('build/**/*').on('change', browserSync.reload);
	  });

	gulp.task('templates:compile', function buildHTML() {
  		return gulp.src('source/template/index.pug')
  		.pipe(pug({
   			 pretty:true
 		 }))
  		.pipe(gulp.dest('build'))
		});