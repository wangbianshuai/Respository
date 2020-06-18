var gulp = require('gulp');
var through = require('through2');
var fs = require("fs");
var path = require("path");

function BuildConfig(name) {
    const pathUrl = name.replace(".js", "").replace("\\", "/")

    const pageConfig = require(`./page-configs/pages/${pathUrl}`);
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
    console.log(fileUrl);
    fs.writeFile(fileUrl, content, function () { })
}

var copyList = [
    { src: "./dist/**/*", dest: path.resolve(__dirname, "").replace("frontend\\a2digitalsolution-web", "backend\\a2digitalsolution-admin\\Admin\\A2DigitalSolution.Web\\wwwroot\\") }
];

gulp.task('default', (done) => {
    gulp.src("./configs/pages/**/*.js")
        .pipe(through.obj(function (file, enc, cb) {
            BuildConfig(file.relative);
            cb();
        }));

    setTimeout(() => {
        copyList.forEach(c => gulp.src(c.src).pipe(gulp.dest(c.dest)));
        done();
    }, 1000);
});
