/**
 * Created by vincentwan on 16/11/7.
 */


define(['base','dialog' , 'float','feedbackTpl'],function($, dialog ,float ,feedbackTpl){
    var browserV = $.browerV();//返回顶部
    var $wrapBody = $("#J_wrapBody");
    var html = "<div id='J_muiBackTop' class='mui-backTop'><ul class='clearfix'>" +
            //"<li class='fiveYear'><a target='_blank' href='/html/storagepage/index.html' class='mui-t1' title='银行存管'></a></li>" + 银行存管图
            "<li><a target='_blank' href='#' class='mui-t2 ga-click xa-click mui-crm dmp-click' ga-hitType='event' ga-category='右侧悬浮窗' ga-action='客服咨询' ga-label='ga-url' xa-category='pc_qq_cs' xa-action='qq_cs_click' xa-label='在线客服' eventType='jump' dev_id='onlineService' textHref='http://csm.xinxindai.com/csm/customer-im/?token=&type=1#/?username=201801231601337570'></a></li>" +
            "<li><a target='_blank' href='/html/introduce/guide.html' class='mui-t3 ga-click xa-click' ga-hitType='event' ga-category='右侧悬浮窗' ga-action='新手福利' ga-label='ga-url' xa-category='pc_fresh_guidline' xa-action='fresh_guidline_click' xa-label='新手福利'></a></li>" +
            "<li><a href='#' class='mui-feedback' ></a></li>" +
            "<li><a href='#' class='mui-top' ></a></li>" +
            "</ul></div>";
    var $html = $(html);
    var $backToTopEle = $html.appendTo($("#J_wrapBody"))
            .find(".mui-top").click(function() {
                $("html, body , #J_wrapBody").animate({ scrollTop:0}, 500);
                return false;
            }), $backToTopFun = function() {

        var st = $wrapBody.scrollTop(),winh = $(window).height(),doch = $(document).height();
        (st > 0)? $backToTopEle.show(): $backToTopEle.hide();
        var footHeight = $('#J_footer').offset().top;
        var loadHeight = st+winh;
        var _top = $(window).height() - 100;
        //if(footHeight<loadHeight) _top = _top-(loadHeight-footHeight);
        if(browserV.ie!='6.0') $backToTopEle.css("top",_top);
        //else $backToTopEle.css("top",_top+st);
    };
    $wrapBody.bind("scroll", $backToTopFun);
    $(function(){$backToTopFun();});
    var _feedbackTpl = null , feedbackDialog = null ,messageDialog = null;;
    $html.find(".mui-crm").on("click" , function (e) {
        var token = $.readCookie("Token")||"";
        var imParam = "?token="+token+"&type=1";
        var imsrc = "//csm.xinxindai.com/csm/customer-im" + imParam;
        var _host = null;
        if ((_host=location.host).indexOf("xinxindai.com")<0) {
            imsrc = "//test-csm.xxd.com/csm/customer-im" + imParam;
        }
        // if (!messageDialog) {
        //     messageDialog = dialog({
        //         content:"<a class='mui-close-im c_close'>×</a><iframe src="+imsrc+"  id=\"J_muiFrameIm\" name=\"frameIm\" scrolling=\"no\" class=\"mui-im-frame\"></iframe>"
        //     });
        // } else {
        //     messageDialog.show();
        // }
        window.open(imsrc , "_blank");
        e && e.preventDefault();
    });

    $html.find(".mui-feedback").on ("click" , function (e){
        if (!_feedbackTpl) {
            //_feedbackTpl = juicer.templates["feedback.tpl.html"]();
            _feedbackTpl = feedbackTpl;
        }
        if (!feedbackDialog) {
            feedbackDialog = dialog({
                content:_feedbackTpl,
                id:"J_feedbackDialog",
                confirm:function (art){
                    var feedbackContactVal = $("#J_feedbackContact").val();
                    var feedbackContentVal = $.trim($("#J_feedbackContent").val());
                    if (!feedbackContentVal || feedbackContentVal.length<3) {
                        float.alert({
                            content:"意见反馈不小于三个字"
                        });
                        return;
                    }
                    var data = $("#J_muiFeedbackForm").serializeObject();
                    _feedbackAjax(data);
                }
            });
        } else {
            feedbackDialog.show();
        }
        e && e.preventDefault();
    });
    var statistics = function (me){
        var len = me.value.length;
        $surplus = $surplus||$("#J_surplus");
        $surplus.html(200-len);
    }
    var $surplus = null;
    $(document).delegate("#J_feedbackContent","keyup keydown",function(){
        var me = this;
        $.debounce(statistics ,100 , me);
    });
    function _feedbackAjax(data){
        $.ajax({
            url:'/biz/interaction/opinion',
            contentType: "application/json",
            dataType:"json",
            beforeSend: function(request) {
                request.setRequestHeader("s", "www");
                request.setRequestHeader("clientId","001");
                request.setRequestHeader("clientTime",new Date().getTime());
            },
            data: $.toJSON (data),
            type:"POST",
            success:function (res){
                var code = res.code;
                if (code==200000){
                    var isClose = 0;
                    var muiAlert = float.alert({
                        content:"问题反馈已提交",
                        callback:function ( art ){
                            art.remove();
                            isClose = 1;
                            if (feedbackDialog) feedbackDialog.close();
                        }
                    });
                    if (!isClose) {
                        setTimeout(function (){
                            muiAlert.remove();
                            if (feedbackDialog) feedbackDialog.close();
                        },2000);
                    }
                    $("#J_muiFeedbackForm")[0].reset();
                } else {
                    alert(res.message);
                }
            },
            error:function (data){
                $.log (data);
            }
        });
    }

});