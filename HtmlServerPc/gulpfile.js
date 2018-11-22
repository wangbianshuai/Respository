const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    mincss = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    clean = require('gulp-clean');
babel = require("gulp-babel");

const g = (src, dest) => { return { src: `./src/${src}`, dest: `./dist/${dest}` } };

const htmlList = [], jsList = [], cssList = [], lessList = [], sassList = [];

const copyList = [
    { src: "./dist/client/views/**/*", dest: "./dist/views/" }
];

const cleanList = [
    "./dist/client/views"
];

gulp.task('html', () => htmlList.forEach(h => gulp.src(h.src).pipe(htmlmin(options)).pipe(gulp.dest(h.dest))));

gulp.task('js', () => jsList.forEach(j => gulp.src(j.src).pipe(babel()).pipe(uglify()).pipe(gulp.dest(j.dest))));

gulp.task("copy", () => copyList.forEach(c => gulp.src(c.src).pipe(gulp.dest(c.dest))));

gulp.task("clean", () => cleanList.forEach(c => gulp.src(c).pipe(clean())));

gulp.task('css', () => cssList.forEach(c => gulp.src(c.src).pipe(mincss()).pipe(gulp.dest(c.dest))));

gulp.task('sass', () => sassList.forEach(c => gulp.src(s.src).pipe(sass()).pipe(mincss()).pipe(gulp.dest(s.dest))));

gulp.task('less', () => lessList.forEach(c => gulp.src(l.src).pipe(less()).pipe(mincss()).pipe(gulp.dest(l.dest))));

gulp.task('default', () => gulp.start('html', 'js', 'sass', 'less', 'css', 'copy', "clean"));
