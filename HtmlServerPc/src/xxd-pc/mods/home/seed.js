var r = {};
if (require) {
    r = require;
}
(function (){

    var globalConfig = window["GLOBAL_STATIC_DATA"]||{};
    var jsVersion = globalConfig.jsVersion || "1.0.0";
    var staticHost = (globalConfig.staticHost||"//test-static.xxd.com") || ("//"+location.hostname+":"+location.port||"80");
    var muiPath = (staticHost+"/mui/"+jsVersion+"/build/")||"//192.168.129.48/mui/build/";
    var pcPath = (staticHost+"/pc/"+jsVersion+"/build/")||"//192.168.129.48/pc/build/";
    var userDO , userId;
    if ((userDO=globalConfig.userDO) && (userId = userDO.id)) {
        window["userId"] = userId;
    }
    r.config({
        baseUrl: pcPath,
        urlArgs: 'ver=v7',
        paths: {
            "jquery": "js/common/jquery.min",
            "base": "js/common/base",
            "json": "js/common/json2",
            "juicer" : "js/common/juicer.min",
            "static":"mods/const",
            "header":'mods/header',
            "footer":'mods/footer',
            "store":"mods/store",
            "rotate":muiPath+"rotate/index",
            "backTop":muiPath+"backTop/index-1",
            "tip":muiPath+"tip/index",
            "dialog":muiPath+"dialog/index",
            "float":muiPath+"dialog-float/index",
            //tpl
            "feedbackTpl":muiPath+'backTop/feedback.tpl.html',
            "floatTpl":muiPath+'dialog-float/float.tpl.html',
            //track
            "track":"js/tracker/track",
            "trackBase":"js/tracker/track-base"
        },
        shim: {
            base:{
                deps: [
                    'jquery',"css"
                ],
                exports:"i am is base!!!"
            },
            rotate:{
                deps: [
                    'mods/css!'+muiPath+'rotate/index.css'
                ],
                exports:"rotate in mui!!!"
            },
            backTop:{
                deps: [
                    'juicer',
                    "feedbackTpl",
                    'dialog',
                    'mods/css!'+muiPath+'backTop/index-1.css'
                ],
                exports:"backTop in mui!!!"
            },
            tip:{
                deps: [
                    'mods/css!'+muiPath+'tip/index.css'
                ],
                exports:"tip in mui!!!"
            },
            dialog:{
                deps:[
                    'mods/css!'+muiPath+'dialog/index.css'
                ],
                exports:"dialog in mui!!!"
            } ,
            float:{
                deps:[
                    'juicer',
                    "floatTpl",
                    'dialog',
                    'mods/css!'+muiPath+'dialog-float/index.css'
                ],
                exports:"float in mui!!!"
            }
        }
    });
    // define ("juicer" ,["Juicer"], function (require){
    //     return juicer;
    // });
    define.amd.jQuery = true;
})();