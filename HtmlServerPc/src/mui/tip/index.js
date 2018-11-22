/**
 * Base
 * @class Calculator-tip.index
 * @module Calculator-tip
 * @author 当下
 * @extend KISSY.Dom, KISSY.EVENT , KISSY.NODE , KISSY.AJAX
 * @constructor Base
 * @param {Object} KISSY common.js DOM, EVENT NODE AJAX
 */
define(['base'],function($){
    var UICOMMON = {
        fnMouseTip: function (self , domObject , showCall , hideCall){
            var $nodeObject = $(domObject);
            var selfThis = this;
            $(self).on("mouseover",function (){
                //self, domObject, showCall, hideCall
                selfThis.fnTip(params);
            });

            if (hideCall) {
                var $close = $nodeObject.find(".close");
                $close.addClass("hide");
                hideCall();
            }
        },
        fnTip:function (self , domObject , showCall , hideCall){
            //self, domObject,
            var showCall = showCall||(void 0);
            var hideCall  = hideCall||(void 0);
            var overTipShow = self.getAttribute("overTipShow")||(void 0);//params.overTipShow;
            var $nodeObject = $(domObject);
            $nodeObject.show();
            if (showCall) showCall();

            function _fn(event){
                var evt = event || window.event;
                var _target = evt.target;
                var id = $nodeObject.attr("id");
                var targetId = $(_target).attr("id");
                if (overTipShow!=="false" && (targetId==id || domObject.contains(_target)) ){
                    return;
                } else if ( $(self).attr("id")==id || self.contains(_target) ) {
                    return ;
                }
                if (hideCall){
                    hideCall();
                }
                $nodeObject.hide();
                $(document).unbind('mousemove',_fn);
            }
            $(document).on('mousemove',_fn);
        },
        loadTpl:function (url,call){
            var _dataJson = $.ajax({
                url: url,
                async:false
            });
            if (_dataJson.readyState==4) {
                return _dataJson.responseData;
            }
            return void 0;
        }
    };
    var fnEffectsMouseOver = function (params){
        var self = params.self , $content = params.$content , showCall = params.showCall , hideCall = params.hideCall;
                $self = $(self),
                contentId = $content.attr("id"),
                checkNode = $("#"+contentId);

        if (!checkNode.length) {
            $("body").append($content);
        } else {
            $content = checkNode;
        }
        var selfOffset =  $self.offset(),
                _selfOffsetTop = selfOffset.top,
                _selfOffsetLeft = selfOffset.left,

                _selfHeight = $self.outerHeight(),
                _selfWidth = $self.outerWidth();

        var $doc = $(document);
        _docScrollTop = $doc.scrollTop(),
                _docScrollLeft = $doc.scrollLeft(),
                _docHeight = $doc.outerHeight();

        var $win = $(window),
                _winHeight = $win.outerHeight(),
                _winWidth = $win.outerWidth();

        var _contentHeight = $content.outerHeight(),
                _contentWidth = $content.outerWidth();

        var _limitTop = _selfOffsetTop - _docScrollTop,
                _limitBottom = _winHeight - _limitTop - _selfHeight,
                _limitLeft = _selfOffsetLeft - _docScrollLeft,
                _limitRight = _winWidth - _limitLeft - _selfWidth;

        var _left = 0, _top = 0 , _arrowLeft = 0,_arrowTop = 0,_arrowName = "mui-calculator-tip-arrow-down";
        var _halfContentHeight =  _contentHeight/2,
                _halfSelfHeight = _selfHeight/2,
                _halfHeight = _halfContentHeight - _halfSelfHeight;

        var _halfContentWidth = _contentWidth/2,
                _halfSelfWidth = _selfWidth/2,
                _halfWidth = _halfContentWidth - _halfSelfWidth;

        var position = $self.attr("position");

        function _fnSlidePosition(){ // 左右两侧
            var fixwhite = 0;//边界值留白的问题 ,  可以不要
            if ( _limitBottom <= 20 || _limitTop <=20 ) {
                fixwhite = 20;
            }
            if ( (_limitTop >= _halfHeight && _limitBottom >= _halfHeight) || _winHeight<_contentHeight ) {
                _top = _selfOffsetTop  - _halfHeight;
                _arrowTop = _halfContentHeight - 10;
            } else if (_limitTop >= _limitBottom && _limitTop >= _halfHeight ){
                _top = _selfOffsetTop - _contentHeight + _limitBottom + _halfSelfHeight + fixwhite;
                _arrowTop = _contentHeight - _limitBottom - 10 - fixwhite;
            } else {
                _top = _selfOffsetTop - _limitTop - fixwhite;
                _arrowTop = _limitTop + _halfSelfHeight - 10 + fixwhite;
            }
        }

        function _fnFluctuatePosition() { //上下
            var fixwhite = 0;//边界值留白的问题 ,  可以不要
            if ( _limitLeft <= 20 || _limitRight <=20 ) {
                fixwhite = 20;
            }

            if ( (_limitLeft >= _halfWidth && _limitRight>=_halfWidth) || _winWidth < _contentWidth ) {
                _left = _selfOffsetLeft - _halfWidth;
                _arrowLeft = _halfContentWidth - 10;
            } else if (_limitLeft > _limitRight && _limitLeft >= _halfWidth) {
                _left  = _selfOffsetLeft - _contentWidth + _limitRight + _halfSelfWidth + fixwhite;
                _arrowLeft = _contentWidth - _limitRight - 10 - fixwhite;
            } else {
                _left = _selfOffsetLeft - _limitLeft - fixwhite;
                _arrowLeft = _limitLeft + _halfSelfWidth -10 + fixwhite;
            }
        }

        function _fnLeft () {
            _arrowName = "mui-calculator-tip-arrow-right";
            _arrowLeft = _contentWidth - 12;
            _left = _selfOffsetLeft - _contentWidth;
            _fnSlidePosition();
        }

        function _fnRight(){
            _arrowName = "mui-calculator-tip-arrow-left";
            _arrowLeft = 0;
            _left = _selfOffsetLeft + _selfWidth;
            _fnSlidePosition();
        }
        function _fnTop () {
            _arrowName = "mui-calculator-tip-arrow-down";
            _arrowTop = _contentHeight - 12;
            _top = _selfOffsetTop - _contentHeight;
            _fnFluctuatePosition();
        }

        function _fnBottom(){
            _arrowName = "mui-calculator-tip-arrow-top";
            _arrowTop = 0;
            _top = _selfOffsetTop + _selfHeight;
            _fnFluctuatePosition();
        }

        function _fnSlide(){
            if (_limitLeft > _limitRight ) {
                _fnLeft();
            } else {
                _fnRight();
            }
        }

        function _fnFluctuate(){
            if (_limitTop > _limitBottom) {
                _fnTop();
            } else {
                _fnBottom();
            }
        }

        function _fnAuto(){//选择最大的空间然后作tip的方向
            var fn = [_fnTop,_fnRight,_fnBottom,_fnLeft],
                    num = [_limitTop,_limitRight,_limitBottom,_limitLeft];
            var index = 0,temp = num[0];
            for (var i  = 1 ,  j = num.length; i < j; i++) {
                if (temp < num[i]) {
                    temp = num[i];
                    index = i;
                }
            }
            fn[index]();
        }
        if (position=="left") {
            _fnLeft();
        } else if (position=="right") {
            _fnRight();
        } else if (position=="top") {
            _fnTop();
        } else if (position=="bottom") {
            _fnBottom();
        } else if (position=="slide") {//左右
            _fnSlide();
        } else if (position=="fluctuate") {//上下
            _fnFluctuate();
        } else {
            _fnAuto();
        }
        $content.css({left:_left,top:_top});
        $content.find(".mui-calculator-tip-arrow").css({left:_arrowLeft,top:_arrowTop}).attr("class",'mui-calculator-tip-arrow '+_arrowName);
        var domContent = $content[0];
        //self , domObject , showCall , hideCall
        UICOMMON.fnTip(self,domContent , showCall , hideCall);
    }
    function initTpl( object){
        var self = object.self , formatCallback = object.formatCallback , iscache = object.cache ,
                $self = $(self);
        var tpl = "<div id='J_calculatorTipToolTip' class='mui-calculator-tip-tooltip clearfix'>"+
                "<div class='mui-calculator-tip-arrow mui-calculator-tip-arrowTop'><div class='mui-calculator-tip-arrowIn'></div></div>"+
                "<div class='mui-calculator-tip-block'></div>"+
                "</div>";
        if (!this._hash) {
            this._hash = {};
        }

        var params = {
            self:self,
            $content:$(tpl),
            showCall:object.showCall||(void 0),
            hideCall:object.hideCall||(void 0)
        };
        var tipContent = $self.attr("tipContent");
        var dataUrl = $self.attr("dataUrl");
        if (tipContent){
            var _tipDate = $self.attr("_tipDate");
            if (_tipDate) {
                var selfhash = this._hash;
                var block = selfhash[$self.attr("_tipDate")];
                if (block){
                    params["$content"] = $("#"+block);
                    if (!iscache && formatCallback) {
                        var jsonString = formatCallback(tipContent , $self);
                        params["$content"].find(".mui-calculator-tip-block").html(jsonString);
                    }
                    fnEffectsMouseOver(params);
                } else {
                    $.log ("dom is error");
                }

            } else {
                var selfhash = this._hash;
                var _tipDate = new Date().getTime();
                selfhash[_tipDate] = "J_calculatorTipToolTip"+_tipDate;
                $self.attr("_tipDate",_tipDate);
                var jsonString = "";//formatCallback(json.data);
                if (formatCallback) {
                    jsonString = formatCallback(tipContent , $self);
                } else {
                    jsonString = tipContent;
                }
                params["$content"].attr("id",selfhash[_tipDate]).find(".mui-calculator-tip-block").html(jsonString);
                fnEffectsMouseOver(params);
            }

        } else if (dataUrl) {
            var selfhash = this._hash;
            var block = selfhash[dataUrl];
            if (block && iscache){
                params["$content"] = $("#"+block);
                fnEffectsMouseOver(params);
            } else {
                var tipType = $self.attr("tipType");
                if (tipType=="jsonp") {
                    $.ajax({
                        dataType:'jsonp',
                        url:dataUrl,
                        jsonp:"jsonpcallback",
                        success:function (json){
                            if (json.status!=200){
                                return;
                            }
                            var jsonString = formatCallback(json.data);
                            selfhash[dataUrl] = "J_calculatorTipToolTip"+new Date().getTime();
                            params["$content"].attr("id",selfhash[dataUrl]).find(".mui-calculator-tip-block").html(jsonString);
                            fnEffectsMouseOver(params);
                        }
                    });
                } else {
                    if (tipType!="get"&&tipType!="post") {
                        tipType = "get";
                    }
                    var dataType = $self.attr("dataType")||"json";
                    $.ajax({
                        type:tipType,
                        dataType:dataType,
                        url: dataUrl,
                        success:function (json){
                            var data = "";
                            if (dataType!="json") {
                                data = json;
                            } else {
                                if (json.status!=200){
                                    return;
                                }
                                data = json.data;
                            }
                            var jsonString = formatCallback(data , $self);
                            selfhash[dataUrl] = "J_calculatorTipToolTip"+new Date().getTime();
                            params["$content"].attr("id",selfhash[dataUrl]).find(".mui-calculator-tip-block").html(jsonString);
                            fnEffectsMouseOver(params);
                        }
                    });
                }
            }
        } else {
            $.log ("params is error , tipContent or dataUrl must choose a parameter ");
        }
    }
    return {init:initTpl,manual:fnEffectsMouseOver};
});
