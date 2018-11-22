/**
 iframe 空白 ，fixed  select zoom
 return dialog Object
 method close() show() remove() create()

 */

define(['base'],function($) {
    $.extend({
        fnHtmlAlert: function(alertJson) {
            var obj = {};
            obj.create = function(content) {
                if (this.state) {
                    alert("dialog存在，不能进行create");
                }
                var array = [];
                var dialogId = alertJson.id||"J_"+(new Date().getTime());
                array.push('<div class="mui-dialog" id="'+dialogId+'">');
                var customClass =  alertJson.customClass||"";
                if ($.isDevicePhone()) array.push("<div class='mui-fix-phone-scroll'></div>");
                array.push('<div class="mui-dialog-inner '+customClass+' clearfix">');
                array.push(content);
                array.push('</div><span class="after"></span></div>');
                var html = array.join("");
                if (!this.$wrapBody) {
                    this.$wrapBody = $("#J_wrapBody");
                }
                this.$dom = $(html);
                this.$wrapBody.append(this.$dom);
                this.fixIeFrame("show");
                this.createEvent(alertJson.cancel, alertJson.confirm);
                this.fixManyDialog(); //fix z-index 多层弹框
                if ($.isDevicePhone()) {
                    if (alertJson.isMove) this.move();
                    $(document).delegate(".mui-fix-phone-scroll" , "touchstart touchmove" , function (ev) {
                        ev && event.preventDefault();
                    });
                }
                this.state = true;
            }
            obj.fill = function (param){
                $.extend(alertJson,param);
                if (this.$dom){
                    var $dialog_inner = this.$dom.find(".mui-dialog-inner");
                    $dialog_inner.html(alertJson.content);
                    this.createEvent(alertJson.cancel, alertJson.confirm);
                }
            }
            obj.close = function() {
                if (!this.state) {
                    alert("dialog不存在,请创建");
                }
                this.$dom.addClass("hide");
                this.fixIeFrame("hide");
                this.fixManyDialog("hide");
            }
            obj.show = function() {
                if (!this.state) {
                    alert("dialog不存在,请创建");
                }
                this.$dom.removeClass("hide");
                this.fixIeFrame("show");
                this.fixManyDialog();
            }
            obj.remove = function() {
                this.fixIeFrame("show");
                this.$dom.remove();
                this.state = false;
            }
            obj.fixIeFrame = function(val) {
                this.brower = $.browerV();
                if (this.brower.ie < '9.0') { //fixed ie 6,7,8 奇葩问题
                    if (!this.$frame) {
                        this.$frame = $("#ifr_cover,#alertBoxWrap").removeClass("hide");
                    }
                    if (val) {
                        this.$dom[val](); // 需要测试
                    }
                    //fix ie
                    //检测 dialog  显示的个数  如果大于1（>=2）
                    //show $frame z-index  递增
                    //hide $frame z-index 递减
                    // ==1 原逻辑
                    var maxZindex = 10000,
                            showLen = 0; //default zindex , 显示的dialog 个数
                    var $dialogs = this.$wrapBody.find(".mui-dialog");
                    for (var i = 0, j = $dialogs.length; i < j && j > 1; i++) {
                        var _$dialog = $dialogs.eq(i);
                        var _hasClass = _$dialog.hasClass("hide");
                        if (!_hasClass) {
                            showLen++;
                            var zindex = _$dialog.css("z-index");
                            if (typeof zindex !== "number") {
                                zindex = parseInt(zindex, 10);
                            }
                            if (zindex > maxZindex) maxZindex = zindex;
                            maxZindex = maxZindex + 3; //为最大的zindex+3
                        }
                    }
                    if (val === "show" || (val === "hide" && showLen > 0)) {
                        if (val === "show") {
                            this.$frame.show();
                            this.$dom.css({ //防止ie6中，manyDialog取最大记录值，重新定义zindex
                                "z-index": maxZindex
                            });
                        } else {
                            maxZindex = maxZindex - 3; //hide 把maxZindex还远最大的dialog的zindex
                        }
                        this.$frame.eq(0).css({ //frame
                            "z-index": maxZindex - 2
                        });
                        this.$frame.eq(1).css({ //shade
                            "z-index": maxZindex - 1
                        });
                        this.$wrapBody.css({
                            overflow: "hidden"
                        });
                    } else {
                        this.$frame.hide();
                        this.$wrapBody.css({
                            overflow: "scroll"
                        });
                    }
                }
            }
            obj.createEvent = function(cancel, confirm) {
                var _this = this;
                var $c_close = _this.$dom.find(".c_close");
                if ($c_close.length > 0) {
                    $c_close.bind("click", function() {
                        if ( cancel ) cancel(_this);
                        else _this.close(_this);
                        return false;
                    });
                }
                var $c_confirm = _this.$dom.find(".c_confirm");

                if ($c_confirm && $c_confirm.length > 0) {
                    $c_confirm.bind("click", function() {
                        if (confirm) confirm(_this);
                        else _this.close(_this);
                        return false;
                    });
                }
            }
            //1 . 当前z-index变为最大 z-index+3
            //2 . ie6 不仅第一步，还需要让frame+1, 遮罩+2
            obj.fixManyDialog = function() {
                var maxZindex = 10000;
                var $dialogs = this.$wrapBody.find(".mui-dialog");
                //console.log ($dialogs.length);
                for (var i = 0, j = $dialogs.length; i < j && j > 1; i++) { //如果长度为1，不需要处理
                    var _$dialog = $dialogs.eq(i);
                    var _hasClass = _$dialog.hasClass("hide");
                    if (!_hasClass) {
                        var zindex = _$dialog.css("z-index");
                        if (typeof zindex !== "number") {
                            zindex = parseInt(zindex, 10);
                        }
                        if (zindex > maxZindex) maxZindex = zindex;
                        maxZindex = maxZindex + 3; //为最大的zindex+3
                    }
                }
                //console.log (maxZindex);
                this.$dom.css({
                    "z-index": maxZindex
                });
            }


            obj.move = function () {
                var me = this;
                //计算height $(".mui-dialog").offset().top
                //mui-dialog-inner
                var $dom = me.$dom;
                //var wrapHeight = $dom.height();
                var $content = $dom.find(".mui-dialog-inner");
                var startY;
                if (!me.contentHeight) {
                    me.contentHeight = $content.height();
                }
                $content.on("touchstart", function(e) {
                    startY = e.originalEvent.changedTouches[0].pageY;
                });
                $content.on("touchmove", function(e) {
                    //var $me  = $(this);
                    //var _offsetTop = parseInt($me.css("top").replace(/px/g,""),10);
                    var moveEndY = parseInt(e.originalEvent.changedTouches[0].pageY,10);
                    var _top =  moveEndY - startY;
                    $content.css("top",_top);
                });
            }
            

            function _fn() {}
            _fn.prototype = obj;
            var f = new _fn;
            f.create(alertJson.content);
            return f;
        }
    });
    return $.fnHtmlAlert;
});