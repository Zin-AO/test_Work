"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssmin = require("gulp-cssmin");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const babel = require('gulp-babel');
const include = require("gulp-include");
const uglify = require('gulp-uglify');
const browsersync = require("browser-sync").create();
const del = require("del");
const panini = require("panini");

/* Paths to source/build/watch files
=========================*/

let path = {
  build: {
    css: "css/",
  },
  src: {
    css: "scss/*.css",

  },
  watch: {
    css: "scss/**/*.css",

  },
  clean: "./dist"
};


/* Tasks
=========================*/

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}


function css() {
  return src(path.src.css, { base: './scss/' })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 3 versions"],
      cascade: false
    }))
    .pipe(cssbeautify())
    .pipe(cssmin())
    .pipe(removeComments())
    .pipe(rename({
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(dest(path.build.css));
}




function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.css], css);
}

const build = gulp.series(clean, gulp.parallel(css));
const watch = gulp.parallel(build, watchFiles, browserSync);


// export tasks

exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
