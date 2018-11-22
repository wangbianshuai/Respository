/**
 * Created by vincentwan on 16/11/25.
 * juicer 虽然为全局如果没有依赖 不会加载juicer
 */
define(["base",'dialog' , 'floatTpl' ,'previewTpl', "juicer"],function ($ , dialog , floatTpl ,previewTpl,jui){
    var Float = {
        alert:function (data){
            // var template = juicer.templates["float.tpl.html"]({
            //     title:data.title||"提示",
            //     content:data.content||""
            // });

            var template = juicer.to_html(floatTpl , {
                title:data.title||"提示",
                content:data.content||""
            });

            var muiAlert = dialog({
                content:template,
                id:"J_muiAlert",
                confirm:function (art){
                    var callback;
                    if (callback = data.callback) {
                        callback(art);
                    } else {
                        art.close();
                    }
                }
            });
            return muiAlert;
        },
        warn:function (){

        },
        error:function (){

        },
        preview:function (data){
            var template,previewDialog,$muiPreviewImg;
            var data = data||{};
            $(document).delegate(".mui-preview" , "click" , function (e){
                var $me = $(this);
                var $preview = $('.mui-preview');
                var len = $preview.length;
                var index = $preview.index($me);
                var imgUrl = $me.attr("_img");
                if (!template) {
                    template = juicer.to_html(previewTpl , {
                        imgUrl:imgUrl
                    });

                    previewDialog = dialog({
                        content:template,
                        id:"J_muiPreview",
                        confirm:function (art){
                            var callback;
                            if (callback = data.callback) {
                                callback(art);
                            } else {
                                art.close();
                            }
                        }
                    });
                    $muiPreviewImg = $("#J_muiPreviewImg");
                } else {
                    $muiPreviewImg.attr("src",imgUrl);
                    previewDialog.show();
                }
                e && e.preventDefault();
            });
        }
    };
    return Float;
});