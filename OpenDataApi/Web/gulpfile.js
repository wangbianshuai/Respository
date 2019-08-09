var gulp = require('gulp');
var through = require('through2');
var fs = require("fs");
var path = require("path");

gulp.task("buildConfigs", () => {
    return gulp.src("./configs/pages/**/*.js")
        .pipe(through.obj(function (file, enc, cb) {
            BuildConfig(file.relative);
            cb();
        }))
});

function BuildConfig(name) {
    const pathUrl = name.replace(".js", "")

    const pageConfig = require(`./configs/pages/${pathUrl}`);
    const content = JSON.stringify(pageConfig);

    const list = pathUrl.split("/")
    const dirUrl = "./dist/configs/" + list.filter((f, i) => i < list.length - 1).join("/");
    const fileUrl = "./dist/configs/" + pathUrl + ".json";

    fs.exists(dirUrl, function (exists) {
        if (exists) SaveContent(fileUrl, content);
        else {
            fs.mkdir(dirUrl, function (err) {
                if (err) console.log(err);
                else SaveContent(fileUrl, content);
            })
        }
    });
}

function SaveContent(fileUrl, content) {
    fs.writeFile(fileUrl, content, function () { })
}

var copyList = [
    { src: "./dist/**/*", dest: path.resolve(__dirname, "").replace("Web", "Api/src/resources/public/html/") }
];

gulp.task("copy", () => {
    copyList.forEach(c => gulp.src(c.src).pipe(gulp.dest(c.dest)));
});

gulp.task('default', () => {
    gulp.start('buildConfigs');
    gulp.start("copy");
});