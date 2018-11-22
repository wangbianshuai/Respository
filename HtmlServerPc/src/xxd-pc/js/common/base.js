define(['jquery'], function ($) {
    $.extend({
        trim: function (string) {
            return (string || "").replace(/(^\s*)|(\s*$)/g, "");
        },

        email: function (string) {
            var regExp = /^([a-z0-9A-Z]+[_\-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
            return regExp.test(string);
        },
        "log": function (msg) {
            //var parentFn = arguments.callee.caller.toString();
            if (window.console) {
                //console.log (parentFn);
                console.log(msg);
            }
        },
        "error": function (msg) {
            if (window.console) console.error(msg);
        },
        "debug": function (msg) {
            if (window.console) console.debug(msg);
        },
        "info": function (msg) {
            if (window.console) console.info(msg);
        },
        browerV: function () {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/webkit\/([\d.]+)/)) ? Sys.webkit = s[1] : //chrome
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            return Sys;
        },
        isIE: function (ver) {
            var b = document.createElement('b');
            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
            return b.getElementsByTagName('i').length === 1;
        },
        isDevicePhone: function () {
            return navigator && navigator.userAgent && navigator.userAgent.match(/android|SymbianOS|Windows Phone|iPhone|iPad|iPod/i);
        },

        isPlaceholderSupport: function () {
            return 'placeholder' in document.createElement('input');
        },
        debounce: function (callback, delay, param) {
            if (typeof(callback) !== "function") {
                return;
            }
            delay = delay || 150;
            if ($._timeoutxxd) window.clearTimeout($._timeoutxxd);
            $._timeoutxxd = window.setTimeout(function () {
                callback(param);
            }, delay);
        }
    });


    $.extend({
        fnObjectKeys: function (object) {
            var arr = [];
            if (Object.keys) {
                arr = Object.keys(object);
            } else {
                for (arr [arr.length] in object) ;
            }
            return arr;
        },
        mockAjax: function (ajaxJosn) {
            if (!ajaxJosn) return;
            if (ajaxJosn.mock) {
                ajaxJosn.success(ajaxJosn.mock);
            } else {
                $.ajax(ajaxJosn);
            }
        },


        cachedScript: function (url, callback) {
            // allow user to set any option except for dataType, cache, and url
            var options = {
                dataType: "script",
                cache: true,
                url: url,
                complete: callback || function () {
                }
            };
            return $.ajax(options);
        },
        parseObject: function (data) {
            return ( new Function("return " + data) )();
        }
    });


    //storeage

    $.extend({

        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },

        // isEmptyObject:function (object) {
        //     var hasProp = false;
        //     if (typeof object === "object" && !(object instanceof Array)){
        //         for (var prop in object){
        //             hasProp = true;
        //             break;
        //         }
        //     }
        //     return hasProp;
        // },

        getUrlParam: function (name, searchString) {
            if (!searchString) searchString = location.search;
            if (typeof searchString == "string") {
                var index = searchString.indexOf("?");
                if (index >= 0) {
                    searchString = searchString.substring(index + 1);
                }
                var params = unescape(searchString).split("&");
                for (var i = 0, j = params.length; i < j; i++) {
                    if (params[i].indexOf("=") > 0) {
                        if (params[i].split("=")[0].toLowerCase() == name.toString().toLowerCase()) {
                            return params[i].split("=")[1];
                        }
                    }
                }
            }
            return null;
        },
        createCookie: function (name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = ";expires=" + date.toGMTString();
            }
            try {
                document.cookie = name + "=" + value + expires + "; path=/";
            } catch (e) {
                //alert("cookie:"+e);
            }

        },
        readCookie: function (name) {
            try {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }
            } catch (e) {
                return null;
            }

            return null;
        },
        eraseCookie: function (name) {
            $.createCookie(name, "", -1);
        },
        clone: function (elem) {
            var clone;
            if ($.support.html5Clone || elem.cloneNode) {
                clone = elem.cloneNode(true);
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }
            // no copy event
            return clone;
        },
        setLocalStorage: function (key, value, days) {
            try {
                if (localStorage) {
                    localStorage.setItem(key, value);
                } else {
                    var len = value.length;
                    if (len < 2000) {
                        this.createCookie(key, value, days);
                    } else {
                        var flag = len / 2000;
                        var iflag = parseInt(flag, 10);
                        if (flag > iflag) {
                            iflag = iflag + 1;
                        }
                        for (var i = 0; i < iflag; i++) {
                            val = value.substring(i * 2000, i * 2000 + 2000);
                            this.createCookie(key + "_" + i, val, days);
                        }
                    }
                }
            } catch (e) {
                //alert("storage:"+e);
                return -1;

            }
        },
        getLocalStorage: function (key) {

            try {
                if (localStorage) {
                    return localStorage.getItem(key);
                } else {

                    var i = 0;
                    var string = "";
                    while (true) {
                        var val = $.readCookie(key + "_" + i);
                        if (!val) break;
                        string += val;
                        i++;
                    }
                    return string;
                }
            } catch (e) {
                //alert("getLocalStorage::"+e);
            }
        },
        clearLocalStore: function (key) {

            try {
                if (localStorage) {
                    localStorage.setItem(key, "");
                    //localStorage.clear();

                } else {
                    var i = 0;
                    while (true) {
                        if ($.readCookie(key + "_" + i)) {
                            $.eraseCookie(key + "_" + i);
                            i++;
                        } else
                            break;
                    }
                }
            } catch (e) {
                //alert("clearLocalStore:"+e);
            }
        }
    });


    //EventUtil single event
    $.extend({
        addEventHandler: function (oTarget, sEventType, fnHandler) {
            if (oTarget.addEventListener) {//for dom - compliant false
                oTarget.addEventListener(sEventType, fnHandler, false);
            } else if (oTarget.attachEvent) { //for ie
                oTarget.attachEvent("on" + sEventType, function () {
                    fnHandler.call(oTarget);
                });
            } else {//other browser
                oTarget["on" + sEventType] = fnHandler;
            }
        },
        removeEventHandler: function (oTarget, sEventType, fnHandler) {
            if (oTarget.removeEventListener) {
                oTarget.removeEventListener(sEventType, fnHandler, false);
            } else if (oTarget.detachEvent) {
                oTarget.detachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = null;
            }
        },
        _formatEvent: function (oEvent) {
            var v = $.browerV();
            if (v.ie) {
                oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
                oEvent.eventPhase = 2;
                oEvent.isChar = (oEvent.charCode > 0);
                oEvent.pageX = oEvent.clientX + document.body.scrollLeft;
                oEvent.pageY = oEvent.clientY + document.body.scrollTop;
                oEvent.preventDefault = function () {
                    this.returnValue = false;
                };
                if (oEvent.type == "mouseout") {
                    oEvent.relatedTarget = oEvent.toElement;
                } else if (oEvent.type == "mouseover") {
                    oEvent.relatedTarget = oEvent.fromElement;
                }
                oEvent.stopPropagation = function () {
                    this.cancelBubble = true;
                };
                oEvent.target = oEvent.srcElement;
                oEvent.time = (new Date).getTime();
            }
            return oEvent;
        },
        getEvent: function () {
            if (window.event) {
                return $._formatEvent(window.event);
            } else {
                return $.getEvent.caller.arguments[0];
            }
        }
    });

    //map
    $.extend({
        Map: function () {
            return (new this._map());
        },
        StringBuffer: function () {
            return (new this._stringBuffer());
        },
        _map: function () {
            this.length = 0;
            this.prefix = "hashMap_www_xxd_20160912";
            this.put = function (key, value) {
                this[this.prefix + key] = value;
                this.length++;
            };
            this.get = function (key) {
                return (typeof this[this.prefix + key] == 'undefined' ? null : this[this.prefix + key]);
            };

            this.keySet = function () {
                var arrKeySet = [];
                for (var obj in this) {
                    if (obj.substring(0, this.prefix.length) == this.prefix)
                        arrKeySet.push(obj.substring(this.prefix.length));
                }

                this.length = arrKeySet.length;
                return arrKeySet.length == 0 ? [] : arrKeySet;
            };
            this.values = function () {
                var arrValues = [];
                for (var obj in this) {
                    if (obj.substring(0, this.prefix.length) == this.prefix)
                        arrValues.push(this[obj]);
                }
                this.length = arrValues.length;
                return arrValues.length == 0 ? [] : arrValues;
            };

            this.size = function () {
                return this.length;
            };

            this.remove = function (key) {
                delete this[this.prefix + key];
                this.length--;
            };

            this.clear = function () {
                for (var obj in this) {
                    if (obj.substring(0, this.prefix.length) == this.prefix)
                        delete this[obj];
                }
            };

            this.isEmpty = function () {
                return this.length == 0;
            };

            this.containKey = function (key) {
                for (var obj in this) {
                    if (obj == this.prefix + key)
                        return true;
                }
                return false;
            };
            this.toString = function () {
                var str = "";
                for (var strKey in this) {
                    if (strKey.substring(0, this.prefix.length) == this.prefix)
                        str += strKey.substring(this.prefix.length) + ":" + this[strKey] + "\r\n";
                }
                return str;
            };
        },
        _stringBuffer: function () {
            this._strings_ = new Array();
            this.append = function (s) {
                this._strings_.push(s);
            };
            this.toString = function () {
                return this._strings_.join("");
            };
        }
    });


    //effect

    $.extend({
        fnTip: function ($self, $tip, params) {
            var params = params || {};
            var showCall = params.showCall || (void 0);
            var hideCall = params.hideCall || (void 0);
            var overTipShow = $self.attr("overTipShow") || params.isoutshow || (void 0);//params.overTipShow;
            $tip.removeClass("hide");
            if (showCall) showCall();


            function _fn(event) {
                var evt = $.getEvent(event);
                var _target = evt.target;

                if (overTipShow !== "false" && ($tip[0] === $self[0] || $tip[0].contains(_target))) {
                    return;
                } else if ($tip[0] === $self[0] || $self[0].contains(_target)) {
                    return;
                }
                if (hideCall) {
                    hideCall();
                }
                $tip.addClass("hide");
                $(document).unbind('mousemove', _fn);
            }

            $(document).bind('mousemove', _fn);
        }
    });

    //convert date  yyyy-MM-dd HH:mm:ss
    $.extend({
        fnDateToString: function (NZRTime, formatString) {/*例时间类型:Fri Dec 12 1980 00:00:00 GMT+0800*/
            var date = new Date(NZRTime);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            if ((month + "").length == 1) month = "0" + month;
            var day = date.getDate();
            if ((day + "").length == 1) day = "0" + day;
            var hour = date.getHours();
            if ((hour + "").length == 1) hour = "0" + hour;
            var minute = date.getMinutes();
            if ((minute + "").length == 1) minute = "0" + minute;
            var second = date.getSeconds();
            if ((second + "").length == 1) second = "0" + second;
            formatString = formatString.replace(/yyyy/, year);
            formatString = formatString.replace(/MM/, month);
            formatString = formatString.replace(/dd/, day);
            formatString = formatString.replace(/HH/, hour);
            formatString = formatString.replace(/mm/, minute);
            formatString = formatString.replace(/ss/, second);
            return formatString;
        },
        /*
         * ("11-22-22","yy-MM-dd") ("2011-22-22","yyyy-MM-dd")
         * ("11/22/22","yy/MM/dd") ("2011/22-22","yyyy/MM/dd")
         * */
        fnStringToDate: function (dateString, formatString) {
            /** year : /yyyy/ */
            var _y4 = "([0-9]{4})";
            /** year : /yy/ */
            var _y2 = "([0-9]{2})";
            /** index year */
            var _yi = -1;
            /** month : /MM/ */
            var _M2 = "(0[1-9]|1[0-2])";
            /** month : /M/ */
            var _M1 = "([1-9]|1[0-2])";
            /** index month */
            var _Mi = -1;
            /** day : /dd/ */
            var _d2 = "(0[1-9]|[1-2][0-9]|30|31)";
            /** day : /d/ */
            var _d1 = "([1-9]|[1-2][0-9]|30|31)";
            /** index day */
            var _di = -1;
            /** hour : /HH/ */
            var _H2 = "([0-1][0-9]|20|21|22|23)";
            /** hour : /H/ */
            var _H1 = "([0-9]|1[0-9]|20|21|22|23)";
            /** index hour */
            var _Hi = -1;
            /** minute : /mm/ */
            var _m2 = "([0-5][0-9])";
            /** minute : /m/ */
            var _m1 = "([0-9]|[1-5][0-9])";
            /** index minute */
            var _mi = -1;
            /** second : /ss/ */
            var _s2 = "([0-5][0-9])";
            /** second : /s/ */
            var _s1 = "([0-9]|[1-5][0-9])";
            /** index month */
            var _si = -1;
            var regexp = "";

            function getDate(dateString, formatString) {
                if (validateDate(dateString, formatString)) {
                    var now = new Date();
                    var vals = regexp.exec(dateString);
                    var index = validateIndex(formatString);
                    var year = index[0] >= 0 ? vals[index[0] + 1] : now.getFullYear();
                    var month = index[1] >= 0 ? (vals[index[1] + 1] - 1) : now.getMonth();
                    var day = index[2] >= 0 ? vals[index[2] + 1] : now.getDate();
                    var hour = index[3] >= 0 ? vals[index[3] + 1] : "";
                    var minute = index[4] >= 0 ? vals[index[4] + 1] : "";
                    var second = index[5] >= 0 ? vals[index[5] + 1] : "";
                    var validate;
                    if (hour == "") {
                        validate = new Date(year, month, day);
                    } else {
                        validate = new Date(year, month, day, hour, minute, second);
                    }
                    if (validate.getDate() == day) {
                        return validate;
                    }
                }
                alert("wrong date");
            }

            function validateDate(_dateString, formatString) {
                var dateString = _dateString;
                if (dateString == "") return;
                var reg = formatString;
                reg = reg.replace(/yyyy/, _y4);
                reg = reg.replace(/yy/, _y2);
                reg = reg.replace(/MM/, _M2);
                reg = reg.replace(/M/, _M1);
                reg = reg.replace(/dd/, _d2);
                reg = reg.replace(/d/, _d1);
                reg = reg.replace(/HH/, _H2);
                reg = reg.replace(/H/, _H1);
                reg = reg.replace(/mm/, _m2);
                reg = reg.replace(/m/, _m1);
                reg = reg.replace(/ss/, _s2);
                reg = reg.replace(/s/, _s1);
                reg = new RegExp("^" + reg + "$");
                regexp = reg;
                return reg.test(dateString);
            }

            function validateIndex(formatString) {
                var ia = new Array();
                var i = 0;
                _yi = formatString.search(/yyyy/);
                if (_yi < 0) _yi = formatString.search(/yy/);
                if (_yi >= 0) {
                    ia[i] = _yi;
                    i++;
                }
                _Mi = formatString.search(/MM/);
                if (_Mi < 0) _Mi = formatString.search(/M/);
                if (_Mi >= 0) {
                    ia[i] = _Mi;
                    i++;
                }
                _di = formatString.search(/dd/);
                if (_di < 0) _di = formatString.search(/d/);
                if (_di >= 0) {
                    ia[i] = _di;
                    i++;
                }
                _Hi = formatString.search(/HH/);
                if (_Hi < 0) _Hi = formatString.search(/H/);
                if (_Hi >= 0) {
                    ia[i] = _Hi;
                    i++;
                }
                _mi = formatString.search(/mm/);
                if (_mi < 0) _mi = formatString.search(/m/);
                if (_mi >= 0) {
                    ia[i] = _mi;
                    i++;
                }
                _si = formatString.search(/ss/);
                if (_si < 0) _si = formatString.search(/s/);
                if (_si >= 0) {
                    ia[i] = _si;
                    i++;
                }
                var ia2 = new Array(_yi, _Mi, _di, _Hi, _mi, _si);
                for (i = 0; i < ia.length - 1; i++) {
                    for (var j = 0; j < ia.length - 1 - i; j++) {
                        if (ia[j] > ia[j + 1]) {
                            temp = ia[j];
                            ia[j] = ia[j + 1];
                            ia[j + 1] = temp;
                        }
                    }
                }
                for (i = 0; i < ia.length; i++) {
                    for (var j = 0; j < ia2.length; j++) {
                        if (ia[i] == ia2[j]) {
                            ia2[j] = i;
                        }
                    }
                }
                return ia2;
            }

            return getDate(dateString, formatString);
        }
    });


    $.fn.extend({
        serializeObject: function () {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    if (/_time|_date|birthday/g.test(this.name)) {
                        this.value = new Date(this.value).getTime() / 1000;
                    }
                    o[this.name].push(this.value || '');
                } else {
                    if (/_time|_date|birthday/g.test(this.name)) {
                        this.value = new Date(this.value).getTime() / 1000;
                    }
                    o[this.name] = this.value || '';
                }
            });
            return o;
        }
    });
    $.extend({
        countdown: function (surplus) {
            var surplusHour = parseInt((surplus / 1000) / 60 / 60);//剩余小时
            var surplusMinute = parseInt((surplus % (1000 * 60 * 60)) / (1000 * 60), 10);//剩余分
            var surplusSecond = parseInt((surplus % (1000 * 60)) / 1000, 10);//剩余秒
            if ((surplusHour + "").length == 1) surplusHour = "0" + surplusHour;
            if ((surplusMinute + "").length == 1) surplusMinute = "0" + surplusMinute;
            if ((surplusSecond + "").length == 1) surplusSecond = "0" + surplusSecond;
            return surplusHour + ":" + surplusMinute + ":" + surplusSecond;
        }
    });

    var con = null;
    if ((con = window.console)) {
        con.info(
            '%c' + [
                ''
                , '一张网页，要经历怎样的过程，才能抵达用户面前？'
                , '一位新人，要经历怎样的成长，才能站在技术之巅？'
                , '探寻这里的秘密；'
                , '体验这里的挑战；'
                , '成为这里的主人；'
                , '加入新新贷，你，可以影响世界。'
                , '如果console前的你热爱前端技术，相信技术改变世界的力量，那么———'
            ].join("\n")
            , [
                'font-size:14px'
                , 'line-height:28px'
                , 'color: #0064b0'
            ].join(';')
        );

        con.log(
            [
                '%c请将简历发送至以下邮箱：\n'
                , '%o'
            ].join("")
            , [
                'font-size:14px'
                , 'line-height:28px'
                , 'color: #000'
            ].join(';')
            , [
                [
                    [
                        {'Email': 'liangchen@xinxindai.com'}
                    ]
                ]
            ]
        );

        con.log(
            '%c邮件标题请以““姓名-应聘XX【前端、产品、java、...】职位-来自console”命名'
            , [
                'font-size:14px'
                , 'line-height:28px'
                , 'color: #f00'
            ].join(';')
        );

        con.log(
            '%c职位介绍：%o'
            , [
                'font-size:18px'
                , 'font-weight:bold'
                , 'line-height:30px'
                , 'color: #0064b0'
            ].join(';')
            , '职位介绍：更新中...【你可以影响世界！】'
        );
    }

    //获取服务器时间
    var SYSTEMTIME,CURRENTTIME = new Date().getTime();
    $.extend({
        getSystemTime: function (callback) {
            $.ajax({
                url: '/feapi/currentTime?'+new Date().getTime(),
                type: 'get',
                data: {},
                dataType: 'json',
                success: function (data) {
                    if (data.code == 200) {
                        SYSTEMTIME = data.data.currentTime;
                    } else {
                        SYSTEMTIME = new Date().getTime();
                    }
                    callback();
                },
                error: function () {
                    SYSTEMTIME = new Date().getTime();
                    callback();
                }
            });
        },
        xxdAjax: function (object) {
            (!SYSTEMTIME)?$.getSystemTime(getXXDAjax):getXXDAjax();
            function getXXDAjax() {
                $.ajax({
                    url: object.url,
                    //crossDomain: true,
                    contentType: object.contentType || "application/json",
                    dataType: object.dataType || "json",
                    beforeSend: function (request) {
                        request.setRequestHeader("clientId", object.clientId || "001");
                        var clientTime = new Date().getTime();
                        clientTime = SYSTEMTIME?(clientTime+SYSTEMTIME-CURRENTTIME):clientTime;
                        request.setRequestHeader("clientTime", clientTime);
                        if (object && object.hasOwnProperty("token")) {
                            request.setRequestHeader("token", object.token || $.readCookie("userToken"));
                        }
                    },
                    data: object.data || "",
                    type: object.type || "POST",
                    success: function (res) {
                        var code = res.code;
                        if (code == 200000) {
                            var isClose = 0;
                            var callback;
                            if (callback = object.callback) {
                                callback(res.data);
                            }
                        } else {
                            $.log(res.message);
                        }
                        var callbacks;
                        if (callbacks = object.callbacks) {
                            callbacks(res);
                        }
                    },
                    error: function (data) {
                        $.log(data);
                    }
                });
            }
        }
    });

    return $;
});




