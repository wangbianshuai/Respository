
/**
 * Created by wanwenwei on 2016/10/14.
 */
define(['base'],function($) {
    function init() {
        var $footerLink = $("#J_footerLink");
        $("#J_moreLink").on ("click",function (){
            var $this = $(this);
            $footerLink.toggleClass("close-down");
        });
        process();
    }
    function process (){
        var $process = $(".j-process");
        for (var i = 0 , j = $process.length; i < j; i++) {
            var $_this = $process.eq(i);
            var _percent = $($_this).attr("tipContent");
            $_this.attr("title", "已投"+_percent+"%").find("span").animate({width:_percent+"%"} , 1500);
        }
    }
    return {
        init:init ,
        process:process
    };
    // if ($process && $process.length > 0 ) {
    //     $process.on("mouseover", function (){
    //         tip.init({
    //             self:this,
    //             formatCallback:function (data , $me){
    //                 $.log ($me);
    //                 return "<div style='padding: 15px;'>已出借"+data+"%</div>";
    //             }
    //         });
    //     });
    // }
});