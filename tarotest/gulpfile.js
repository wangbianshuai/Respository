// eslint-disable-next-line import/no-commonjs
var gulp = require('gulp');
// eslint-disable-next-line import/no-commonjs
var through = require('through2');
// eslint-disable-next-line import/no-commonjs
var fs = require("fs");

gulp.task("buildConfigs", () => {
  return gulp.src("./page-configs/pages/**/*.js")
    .pipe(through.obj(function (file, enc, cb) {
      buildConfig(file.relative);
      cb();
    }))
});

function buildConfig(name) {
  const pathUrl = name.replace(".js", "").replace("\\", "/")

  const pageConfig = require(`./page-configs/pages/${pathUrl}`);
  const content = JSON.stringify(pageConfig);

  const list = pathUrl.split("/")
  const dirUrl = "./miniprogramconfigs/" + list.filter((f, i) => i < list.length - 1).join("/");
  const fileUrl = "./miniprogramconfigs/" + pathUrl + ".json";

  fs.exists(dirUrl, function (exists) {
    if (exists) saveContent(fileUrl, content);
    else {
      fs.mkdir(dirUrl, function (err) {
        if (err) console.log(err);
        else saveContent(fileUrl, content);
      })
    }
  });
}

function saveContent(fileUrl, content) {
  console.log(fileUrl);
  fs.writeFile(fileUrl, content, function () { })
}

gulp.task('default', gulp.series('buildConfigs'));
