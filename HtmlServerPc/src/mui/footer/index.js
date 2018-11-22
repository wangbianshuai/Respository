define(['base',  'footerTpl','pcFooter'],function($ ,  footerTpl , pcFooter) {
    "use strict";
    if (footerTpl) {
        $("#J_footer").html(footerTpl);
        pcFooter.init();
    }
    // $.ajax({
    //     url:'/biz/bulletin/link',
    //     contentType: "application/json",
    //     dataType:"json",
    //     beforeSend: function(request) {
    //         request.setRequestHeader("s", "www");
    //         request.setRequestHeader("clientId","001");
    //         request.setRequestHeader("clientTime","001");
    //     },
    //     data: {
    //         pageSize:50,
    //         currentPage:1
    //     },
    //     type:"get",
    //     success:function (res){
    //         var code = res.code ,data , items;
    //         if (code==200000 && (data = res.data) && (items=data.items) && items.constructor == Array ){
    //             var footerLinkList = $(".footer-link-list")  , array = [];
    //             for (var i  = 0 , j = items.length; i <j; i++) {
    //                 var item = items[i];
    //                 array.push("<li><a href='"+item.textHref+"' target='_blank'>"+item.text+"</a></li>");
    //             }
    //             footerLinkList.html(array.join(""));
    //         } else {
    //             $.log(res.message);
    //         }
    //     },
    //     error:function (data){
    //         $.log (data);
    //     }
    // });
});