var gulp = require('gulp');
var through = require('through2');
var fs = require('fs');
var rename = require('gulp-rename');

function buildConfig(name) {
    const pathUrl = name.replace(".js", "").replace("\\", "/")

    const pageConfig = require(`./page-configs/pages/${pathUrl}`);
    const content = JSON.stringify(pageConfig);

    const list = pathUrl.split("/")
    const dirUrl = "./dist/configs/" + list.filter((f, i) => i < list.length - 1).join("/");
    const fileUrl = "./dist/configs/" + pathUrl + ".json";

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
var htmls = ['login.html', 'accountBillList.html'];
var copyList = [];

htmls.forEach(name => {
    copyList.push({ src: './dist/index.html', dest: './dist/', newName: name + '.html' });
});

gulp.task('default', (done) => {
    gulp.src("./page-configs/pages/**/*.js")
        .pipe(through.obj(function (file, enc, cb) {
            buildConfig(file.relative);
            cb();
        }));

    setTimeout(() => {
        copyList.forEach(c => gulp.src(c.src).pipe(rename(c.newName)).pipe(gulp.dest(c.dest)));
        done();
    }, 1000);
});
