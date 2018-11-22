/**
 * Created by vincentwan on 16/11/7.
 */


define(['base'],function($ ){
    var browserV = $.browerV();//返回顶部
    var $wrapBody = $("#J_wrapBody");
    var $backToTopTxt = "", $backToTopEle = $('<a href="#" class="backToTop"></a>').appendTo($("#J_wrapBody"))
            .text($backToTopTxt).attr("title", $backToTopTxt).click(function() {
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
});