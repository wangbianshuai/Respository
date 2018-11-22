define(['base',  'headerTpl' , 'pcHeader', 'trackBase'],function($ ,  headerTpl , pcHeader , track) {
    "use strict";
    if (headerTpl) {
        $("#J_header").html(headerTpl);
        pcHeader.init();
    }
    var token = $.readCookie("Token");
    if (token) {
        $.ajax({
            url:'/feapi/userInfo.html',
            contentType: "application/json",
            dataType:"json",
            data: {
                userToken:token
            },
            type:"get",
            success:function (res){
                if (res && res.status) {
                    $("#J_navLogin,#J_navRegister").addClass("hide");
                    $(".j_userDropdown").html(res.nickName+"<i></i>").removeClass("hide");
                    track.init(res);
                } else {
                    track.init();
                }
            },
            error:function (data){
                $.log (data);
                track.init();
            }
        });
    } else {
        track.init();
    }
});