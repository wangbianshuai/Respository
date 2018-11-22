define(['base', "loading" , "fileupload" , 'iframe' ],function($ ,loading) {

    var loadingDialog = null;

    return {
        files:function (object){
            var object = object ||{};
            var $dom = object.$dom || $('#J_uploadFile');
            var interval , startTime, endTime;
            $dom.fileupload({
                url:object.url,
                autoUpload:true,
                type:'post',
                formData:object.formData||{},
                acceptFileTypes:/\.(jpg|jpeg|png|doc|docx|xls|xlsx|ppt|pptx|pdf|avi|rmvb|mp4|mp3)$/i,
                maxFileSize:object.size||524288000,//500M
                beforeSend:function(request){
                    startTime =  new Date().getTime();
                    var headers = object.headers||{};
                    for (var o in headers) {
                        request.setRequestHeader(o , headers[o]);
                    }
                },
                add:function (e , data){
                    $.log ("add fileupload");
                    $.log (data);

                    if (!loadingDialog) {
                        loadingDialog = loading.loading();
                    } else {
                        loadingDialog.show();
                    }
                    data.submit();
                },
                success:function(data){
                    if(data.code != '200000'){
                        $.log (data);
                        return false;
                    }else{
                        var callback = null;
                        if (callback=object.callback){
                            callback(data.data);
                        }
                    }
                    if (loadingDialog) loadingDialog.close();
                },
                progressall: function (e, data) {
                    $.log ("progress all");
                    //if (loadingDialog) loadingDialog.close();
                },
                fileuploadprogress: function (e, data) {
                    // if (!loadingDialog) {
                    //     loadingDialog = loading.loading();
                    // } else {
                    //     loadingDialog.show();
                    // }
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $.log ("加载进度：：："+progress);
                },

                processfail:function(){
                    $.log ("processfail");
                },

                fail:function(){
                    $.log ("file upload fail");
                    endTime =  new Date().getTime();
                    $.log ( "uploadTime:"+(endTime - startTime) );
                    if (loadingDialog) loadingDialog.close();
                }
            });
        }
    };
});