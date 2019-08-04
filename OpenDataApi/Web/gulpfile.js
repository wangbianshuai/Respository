var gulp = require('gulp');
var path = require("path");


var copyList = [
    { src: "./configs/**/*", dest: "./dist/configs/" },
    { src: "./dist/**/*", dest: path.resolve(__dirname, "").replace("Web", "Api/src/main/resources/public/html/") }
];

gulp.task("copy", () => {
    copyList.forEach(c => gulp.src(c.src).pipe(gulp.dest(c.dest)));
});

gulp.task('default', () => gulp.start('copy'));
