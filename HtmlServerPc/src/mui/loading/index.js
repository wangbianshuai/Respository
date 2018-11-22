/**
 * Created by vincentwan on 16/11/25.
 * juicer 虽然为全局如果没有依赖 不会加载juicer
 */
define(["base",'dialog'],function ($ , dialog ){
    var dialogLoading = {
        loading:function (html){
            if (!html) html="";
            var template = '<div class="mui-spinner">' +
                html+
                '<div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div> ' +
                '<div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div> ' +
                '<div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div> ' +
                '</div>';
            var fullScreen = dialog({
                content:template,
                id:"J_muiLoading"
            });
            return fullScreen;
        }
    };
    return dialogLoading;
});