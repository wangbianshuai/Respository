/*
 * XXDai analytics
 * 该工具用来打点。其对外暴露了三种可供使用的方法:setURL、pageView和eventView。
 *  具体埋点 function 如下：
 *  _trackPageview   页面跟踪
 *  _trackEvent      事件跟踪
 * 版本支持：PC.WebAPP
 * version : 1.1.4
 */
(function () {
    /**
     * _xa_config
     * @type {{domain: string, path: string, url: string, userid: string, siteid: string, version: string, switch: number}}
     * @private
     */
    window["_mvtrack"] = window["_mvtrack"] || [];
    window["_mvtrack"].push(["$setAccount", "xa-8859-02"]);
    window._xa_config = {
        domain: "",  //域名,pc为.xinxindai.com;移动webapp为：.xinxindai.com/m/
        path: "/m",  //地址,pc 为 '/';移动webapp为：/m
        url: "",     //采集url:https://www.xinxindai.com/_xa.gif
        userid: "",  //用户id
        siteid: "xa-8859-01",//webapp:xa-8859-01 pc:xa-8859-02
        version: "1.1.4",// xa版本
        off: 1   //开关 1：开；0：关
    };
    if (typeof(_mvtrack) != "undefined" && _mvtrack && _mvtrack[0] && _mvtrack[0][1]) { //$setAccount
        _xa_config.domain = "";
        _xa_config.path = "/";
        _xa_config.siteid = _mvtrack[0][1];
    }

    var JSON_TYPE = "get";
    var _uccn = "utm_campaign"; // name
    var _ucmd = "utm_medium";  // medium (cpc|cpm|link|email|organic)
    var _ucsr = "utm_source";  // source
    var _uctr = "utm_term";  // term/keyword
    var _ucct = "utm_content"; // content

    //-- Auto/Organic Keywords to Ignore 设置忽略关键词
    var _uOno = new Array();
    //-- Auto/Organic Sources and Keywords 搜索引擎、关键词参数名
    var _uOsr = new Array();
    var _uOkw = new Array();
    var _uDms = new Array();
    _uOsr[0] = "google";
    _uOkw[0] = "q";
    _uOsr[1] = "yahoo";
    _uOkw[1] = "p";
    _uOsr[2] = "msn";
    _uOkw[2] = "q";
    _uOsr[3] = "aol";
    _uOkw[3] = "query";
    _uOsr[4] = "aol";
    _uOkw[4] = "encquery";
    _uOsr[5] = "lycos";
    _uOkw[5] = "query";
    _uOsr[6] = "ask";
    _uOkw[6] = "q";
    _uOsr[7] = "altavista";
    _uOkw[7] = "q";
    _uOsr[8] = "netscape";
    _uOkw[8] = "query";
    _uOsr[9] = "cnn";
    _uOkw[9] = "query";
    _uOsr[10] = "looksmart";
    _uOkw[10] = "qt";
    _uOsr[11] = "about";
    _uOkw[11] = "terms";
    _uOsr[12] = "mamma";
    _uOkw[12] = "query";
    _uOsr[13] = "alltheweb";
    _uOkw[13] = "q";
    _uOsr[14] = "gigablast";
    _uOkw[14] = "q";
    _uOsr[15] = "voila";
    _uOkw[15] = "rdata";
    _uOsr[16] = "virgilio";
    _uOkw[16] = "qs";
    _uOsr[17] = "live";
    _uOkw[17] = "q";
    _uOsr[18] = "baidu";
    _uOkw[18] = "wd";
    _uOsr[19] = "alice";
    _uOkw[19] = "qs";
    _uOsr[20] = "yandex";
    _uOkw[20] = "text";
    _uOsr[21] = "najdi";
    _uOkw[21] = "q";
    _uOsr[22] = "aol";
    _uOkw[22] = "q";
    _uOsr[23] = "club-internet";
    _uOkw[23] = "q";
    _uOsr[24] = "mama";
    _uOkw[24] = "query";
    _uOsr[25] = "seznam";
    _uOkw[25] = "q";
    _uOsr[26] = "search";
    _uOkw[26] = "q";
    _uOsr[27] = "szukaj";
    _uOkw[27] = "szukaj";
    _uOsr[28] = "szukaj";
    _uOkw[28] = "qt";
    _uOsr[29] = "netsprint";
    _uOkw[29] = "q";
    _uOsr[30] = "google.interia";
    _uOkw[30] = "q";
    _uOsr[31] = "szukacz";
    _uOkw[31] = "q";
    _uOsr[32] = "yam";
    _uOkw[32] = "k";
    _uOsr[33] = "pchome";
    _uOkw[33] = "q";
    _uOsr[34] = "bing";
    _uOkw[34] = "q";

    _uDms = ".com.cn,.edu.cn,.net.cn,.org.cn,.co.jp,.gov.cn,.co.uk,ac.cn,.edu,.tv,.info,.com,.ac,.ag,.am,.at,.be,.biz,.bz,.cc,.cn,.de,.es,.eu,.fm,.gs,.hk,.in,.info,.io,.it,.jp,.la,.md,.ms,.name,.net,.nl,.nu,.org,.pl,.ru,.sc,.se,.sg,.sh,.tc,.tk,.tv,.tw,.us,.co,.uk,.vc,.vg,.ws,.il,.li,.nz".split(',');
    function getReferrer() {
        var referrer = '';
        try {
            referrer = window.top.document.referrer;
        } catch (e) {
            if (window.parent) {
                try {
                    referrer = window.parent.document.referrer;
                } catch (e2) {
                    referrer = document.referrer;
                }
            }
        }
        return referrer;
    }

    //截取URL参数方法（需处理URL参数字符串，参数名[a=]，截止字符）
    function _uGC(l, n, s) {
        if (!l || l == "" || !n || n == "" || !s || s == "") return "-";
        var i, i2, i3, c = "-";
        i = l.indexOf(n);
        i3 = n.indexOf("=") + 1;
        if (i > -1) {
            i2 = l.indexOf(s, i);
            if (i2 < 0) {
                i2 = l.length;
            }
            c = l.substring((i + i3), i2);
            if (c.indexOf('#!') > -1)c = c.substring(0, c.indexOf('#!'));
        }
        c = _uEC(c);
        return c;
    }

    //URI解码
    function _uUES(s) {
        if (typeof(decodeURIComponent) == 'function') {
            return decodeURIComponent(s);
        } else {
            return unescape(s);
        }
    }

    //将URL中的空格替换成+
    function _uEC(s) {
        var n = "";
        if (!s || s == "") return "";
        for (var i = 0; i < s.length; i++) {
            if (s.charAt(i) == " ") n += "+"; else n += s.charAt(i);
        }
        s = n;
        n = '';
        for (var i = 0; i < s.length; i++) {
            if (s.charAt(i) == ".") n += "_"; else n += s.charAt(i);
        }
        return n;
    }

    //将URL中的s0替换成s1
    function _uEC1(s, s0, s1) {
        var n = "";
        if (!s || s == "") return "";
        for (var i = 0; i < s.length; i++) {
            if (s.charAt(i) == s0) n += s1; else n += s.charAt(i);
        }
        return n;
    }

    //搜索引擎来源的解析
    function _uOrg(t) {
        var _ur = getReferrer();
        if (_ur == "0" || _ur == "" || _ur == "-") return "";
        var i = 0, h, k;
        if ((i = _ur.indexOf("://")) < 0) return "";
        h = _ur.substring(i + 3, _ur.length);
        if (h.indexOf("/") > -1) {
            h = h.substring(0, h.indexOf("/"));
        }
        for (var ii = 0; ii < _uOsr.length; ii++) {
            if (h.toLowerCase().indexOf(_uOsr[ii].toLowerCase()) > -1) {
                if ((i = _ur.indexOf("?" + _uOkw[ii] + "=")) > -1 || (i = _ur.indexOf("&" + _uOkw[ii] + "=")) > -1) {
                    k = _ur.substring(i + _uOkw[ii].length + 2, _ur.length);
                    if ((i = k.indexOf("&")) > -1) k = k.substring(0, i);
                    for (var yy = 0; yy < _uOno.length; yy++) {
                        if (_uOno[yy].toLowerCase() == k.toLowerCase()) {
                            _ufno = 1;
                            break;
                        }
                    }
                    if (t) return _uEC(k);
                    else return "utmcsr=" + _uEC(_uOsr[ii]) + "|utmccn=(organic)|utmctr=" + _uEC(k) + "|utmcmd=(organic)";
                }
            }
        }
        h = h.toLowerCase();
        for (var ii = 0; ii < _uDms.length; ii++) {
            if (h.indexOf(_uDms[ii]) > -1) {
                h = h.substring(0, h.indexOf(_uDms[ii]));
                h = h.substring(h.lastIndexOf('.') + 1);
                break;
            }
        }
        if (h.indexOf(':') > -1)h = h.substring(0, h.indexOf(':'));
        h = _uEC(h);
        if (h != '') return "utmcsr=" + h + "|utmccn=(organic)|utmctr=(organic)|utmcmd=(organic)";
        return "";
    }

    var _utm_source = '-.-';
    //获取搜索引擎信息
    function _uCInfo(purl) {
        var c = "", t = "-", t2 = "-", t3 = "-", t4 = "-", t5 = "-", z = "-", s = "";
        var org = _uOrg();
        s = location.href + "&";
        z = getReferrer();
        if (z != '' && z.indexOf('://' + GetDomain()) > -1)return '';
        if(purl&&purl!=''){
            var _t = _uGC(purl + "&", _ucsr + "=", "&");
            if(_t!='-' && _t != '')s = purl + "&";
        }
        t2 = _uGC(s, _ucsr + "=", "&");
        if (t2 != '-' && t2 != ''/*&& z != ''*/) {
            _utm_source = t2 + '.0';
            c = 'utmcsr=' + t2;
            t3 = _uGC(s, _uccn + "=", "&");
            if (t3 != '-' && t3 != '')c += '|utmccn=' + t3;
            t4 = _uGC(s, _uctr + "=", "&");
            if (t4 != '-' && t4 != '')c += '|utmctr=' + t4;
            t = _uGC(s, _ucmd + "=", "&");
            if (t != '-' && t != '')c += '|utmcmd=' + t;
            t5 = _uGC(s, _ucct + "=", "&");
            if (t5 != '-' && t5 != '')c += '|utmcct=' + t5;
            return c;
        }
        s = z + "&";

        t = _uGC(s, _ucmd + "=", "&");
        t2 = _uGC(s, _ucsr + "=", "&");
        t3 = _uGC(s, _uccn + "=", "&");
        t4 = _uGC(s, _uctr + "=", "&");
        t5 = _uGC(s, _ucct + "=", "&");

        if (org == ''/*&&(t2=='-'||t2=='')*/) {
            c = "utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)";
            /*if(t2!='-'&&t2!='')c+="|utmcsr=" + t2;
             if(t3!='-'&&t3!='')c += '|utmccn=' + t3;
             if(t4!='-'&&t4!='')c+="utmctr=" + t4;
             if(t5!='-'&&t5!='')c+="|utmcct=" + t5;*/
            return c;
        }
        var cc = org.split('|');
        _utm_source = cc[0].split('=')[1] + '.1';
        if (org != '' && ((t != "-" && t != "") || (t2 != "-" && t2 != "") || (t3 != "-" && t3 != "") || (t4 != "-" && t4 != "") || (t5 != "-" && t5 != ""))) {
            c = cc[0] + '|';
            if (t3 != "-" && t3 != "") {
                c += "utmccn=" + _uEC(t3) + '|';
            } else {
                c += cc[1] + '|';
            }
            c += cc[2] + '|';
            if (t != "-" && t != "") {
                c += "utmcmd=" + _uEC(t);
            } else {
                c += 'utmcmd=(organic)';
            }
            //if(t2!='-'&&t2!='')c+="|utmcsr=" + t2;
            if (t4 != '-' && t4 != '')c += "|utmctr=" + t4;
            if (t5 != '-' && t5 != '')c += "|utmcct=" + t5;

            return c;
        }
        return org;
    }

    var Tool = {},//一些底层的工具函数集
            Hanlder = {},//业务处理函数集
            Track = null;

    /**
     * 闭函数 request
     */
    Tool.request = function (param) {
        var json = {
            url: param.url,
            type: param.type,
            async: param.async || true,
            data: param.data,
            success: param.success,
            error: param.error
        };
        var kv = "";
        if (typeof json.data != "string") {
            var data = json.data;
            var arr = [];

            for (var k in data) {
                if (k === 'uri' || k === 'page_url' || k === 'page_referer' || k === 'title' || k === 'label' || k === 'cookie' || k === 'utmcc') {
                    arr.push(k + "=" + encodeURIComponent(data[k]));
                } else {
                    arr.push(k + "=" + data[k]);
                }
            }

            kv = arr.join('&');
        } else {
            kv = data;
        }
        if (json.type.toLowerCase() == "jsonp") {
            var script = document.createElement("script");
            var scriptO = null;
            window.jsonpCallBack = function (data) {
                json.success(data);

                if (scriptO && scriptO.parentNode) {
                    scriptO.parentNode.removeChild(scriptO);
                }
            };
            script.src = json.url + "?" + kv + "&callBack=jsonpCallBack";
            scriptO = document.getElementsByTagName("body")[0].appendChild(script);
        } else if (window.XMLHttpRequest) {
            var request = new XMLHttpRequest();
            request.open(json.type, json.url + "?" + kv, json.async);

            if (json.type.toLowerCase() == "get") {
                request.send(json.data);
            } else if (json.type.toLowerCase() == "post") {
                request.send();
            }

            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    json.success(request.responseText);
                } else {
                    json.error(request.readyState + "  " + request.status);
                }
            };
        }
    };

    /**
     * 判断pc端和手机端
     */
    Tool.isPC = function () {
        var userAgentInfo = navigator.userAgent;
        var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < agents.length; v++) {
            if (userAgentInfo.indexOf(agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    /**
     * 获取当前浏览器的内核类型及版本号
     */
    Tool.getBrowserInfo = function () {
        var agent = navigator.userAgent.toLowerCase();
        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        var regStr_android = /android\s+[\d.]+/gi;
        var regStr_iphone = /version\/[\d.]+/gi;

        //Android
        if (agent.indexOf("android") > 0) {
            return agent.match(regStr_android)[0];
        }

        //Iphone
        if (agent.indexOf("iphone") > 0) {
            var version = "";
            var iphoneVersion = "iphone";

            if (agent.match(regStr_iphone) && agent.match(regStr_iphone)[0]) {
                version = agent.match(regStr_iphone)[0].replace("version", "");
            }
            iphoneVersion = iphoneVersion + version;
            return iphoneVersion;
        }

        //IE
        if (agent.indexOf("msie") > 0) {
            return agent.match(regStr_ie)[0];
        }

        //firefox
        if (agent.indexOf("firefox") > 0) {
            return agent.match(regStr_ff)[0];
        }

        //Chrome
        if (agent.indexOf("chrome") > 0) {
            return agent.match(regStr_chrome)[0];
        }

        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            return agent.match(regStr_saf)[0];
        }
    };


    /**
     * 生成唯一uuid。
     */
    Tool.uuid = function (len, radix) {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var chars = CHARS, uuid = [], i;

        radix = radix || chars.length;

        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];

        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };

    /**
     * 对cookie进行设置、获取和删除的工具集。
     */
    Tool.cookie = {
        setCookie: function (name, value, path, domain, minutes) {
            var m = 3 * 365 * 24 * 60;
            if (minutes)m = minutes;
            var exp = new Date();
            exp.setTime(exp.getTime() + m * 60 * 1000);
            var expire = ";expires=" + exp.toGMTString();
            if (minutes == -1) {
                var isIE = !-[1, ];
                if (isIE)
                    expire = ";expires=At the end of the Session";
                else
                    expire = ";expires=Session";
            }
            document.cookie = name + "=" + (name == '__utmz' ? value : escape(value)) + expire + ";path=" + path;// + ";domain=" + domain + ";";
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

            if (arr = document.cookie.match(reg)) {
                return name == '__utmz' ? arr[2] : unescape(arr[2]);
            } else {
                return null;
            }

        },
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);

            var cval = Tool.cookie.getCookie(name);
            if (cval != null) {
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";";
            }
        }
    };

    /**
     * 用来对当前页面url后面的参数进行截取，其返回值为一个key、value的json对象。
     * return : 返回值为当前页面url后面的参数以属性、值方式显示的对象，没有任何值则返回null
     */
    Tool.subUrlParams = function (params) {
        var isExistchar = params || undefined;//可选参数

        var json = null,//返回值
                URL = location.href;//当前url

        var URLParamsStr = "",//参数字符串
                URLParamsKVArr = [];//参数对

        if (URL.indexOf("?") == -1) {
            return json;
        }

        if (isExistchar != undefined) {
            URLParamsStr = URL.substring(URL.indexOf("?") + 1, URL.indexOf(isExistchar));
        } else {
            URLParamsStr = URL.substring(URL.indexOf("?") + 1);
        }

        if (URLParamsStr.indexOf("&") != -1) {
            URLParamsKVArr = URLParamsStr.split("&");
        } else {
            URLParamsKVArr.push(URLParamsStr);
        }

        var jsonStr = "{",
                json = null;

        for (var i = 0; i < URLParamsKVArr.length; i++) {

            var arr = URLParamsKVArr[i].split("=");

            if (i != (URLParamsKVArr.length - 1)) {
                jsonStr += "'" + arr[0] + "':'" + arr[1] + "',";
            } else {
                jsonStr += "'" + arr[0] + "':'" + arr[1] + "'";
            }
        }
        jsonStr += "}";

        json = eval("(" + jsonStr + ")");

        return json;
    };

    Tool.hashCode = function (str) {
        var h = 0;
        var len = str.length;
        var t = 2147483648;
        for (var i = 0; i < len; i++) {
            h = 31 * h + str.charCodeAt(i);
            if (h > 2147483647) h %= t;
        }
        /*var t = -2147483648 * 2;
         while (h > 2147483647) {
         h += t
         }*/
        return h;
    };

    function GetDomain() {
        return (_xa_config.domain && _xa_config.domain != '') ? _xa_config.domain : document.domain;
    }
    function getMyUrlParam(){
        var pattern = new RegExp("[?&]"+"utm_source"+"\=([^&]+)", "g");
        var matcher = pattern.exec(location.href);
        var items = null;
        if(null != matcher){
            try{
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            }catch(e){
                try{
                    items = decodeURIComponent(matcher[1]);
                }catch(e){
                    items = matcher[1];
                }
            }
        }
        // console.log(items);
        return items;
    }
    /**
     * 对业务处理
     * return JSON对象 data
     * page_url : page_url
     * virtual_url: json.virtual_url
     * userid : userid
     * pid: 产品id
     */
    Hanlder.websiteHanlder = function (json) {
        var data = {
            page_url: json.page_url,
            virtual_url: json.virtual_url || "",   //虚拟页面地址
            userid: json.userid || '0',           //userid
            pid: json.pid || "",                  //产品id
            ref: "",                             // referer
            kid: "",                             //唯一编码
            utmcc: ""
        };

        var __utma = Tool.cookie.getCookie("__utma");
        var __utmb = Tool.cookie.getCookie("__utmb");
        var xxd_utm_source = Tool.cookie.getCookie("xxd_utm_source");
        var utm_cn = 0;
        var zinfo = _uCInfo(json.page_url);
        var setUtma = true;
        var _now = new Date().getTime();
        if (__utma) {
            var utma = __utma.split('.');
            if (utma.length == 6) {
                data.kid = utma[1];
                if (!__utmb) {
                    __utma = utma[0] + '.' + utma[1] + '.' + utma[2] + '.' + utma[4] + '.' + _now + '.' + (parseInt(utma[5]) + 1);
                } else {
                    setUtma = false;
                }
            } else {
                __utma = null;
            }
        }
        if (!__utma) {
            data.kid = Tool.uuid();
            __utma = Tool.hashCode(_xa_config.siteid) + '.' + data.kid + '.' + _now + '.' + _now + '.' + _now + '.1';
        }
        if (setUtma)
            Tool.cookie.setCookie("__utma", __utma, _xa_config.path, GetDomain(), 2 * 365 * 24 * 60);
        var setUtmb = false;
        if (__utmb) {
            var utmb = __utmb.split('.');
            if (utmb.length >= 4) {
                __utmb = utmb[0] + '.' + (parseInt(utmb[1]) + 1) + '.1.' + utmb[3];
                if (utmb.length > 5) {
                    if (utmb[5] == '0') {
                        //utm_cn=0;
                        if (utmb[4] != _utm_source.split('.')[0])utm_cn = 1;
                        __utmb += '.' + utmb[4] + '.0';
                    } else {
                        if (utmb[4] != _utm_source.split('.')[0])utm_cn = 1;
                        __utmb += '.' + _utm_source;
                    }
                } else {
                    __utmb += '.' + _utm_source;
                }
            } else {
                __utmb = null;
            }
        }
        if (!__utmb) {
            __utmb = Tool.hashCode(_xa_config.siteid) + '.1.1.' + _now + '.' + _utm_source;
            setUtmb = true;
        }
        Tool.cookie.setCookie("__utmb", __utmb, _xa_config.path, GetDomain(), 30);

        var __utmc = Tool.cookie.getCookie("__utmc");
        if (!__utmc) {
            Tool.cookie.setCookie("__utmc", Tool.hashCode(_xa_config.siteid), _xa_config.path, GetDomain(), -1);
        }

        var __utmz = Tool.cookie.getCookie("__utmz");
        if (__utmz) {
            var utmz = __utmz.split('.');
            if (utmz.length >= 4) {
                var cn = utmz[3];
                if (setUtmb)cn = cn * 1 + 1;
                else cn = cn * 1 + utm_cn;
                __utmz = utmz[0] + '.' + utmz[1] + '.' + __utma.split('.')[5] + '.' + cn + '.' + zinfo;
                if (zinfo == '')__utmz = utmz[0] + '.' + utmz[1] + '.' + __utma.split('.')[5] + '.' + utmz[3] + '.' + utmz[4];
            } else {
                __utmz = null;
            }
        }
        if (!__utmz) {
            __utmz = Tool.hashCode(_xa_config.siteid) + '.' + _now + '.' + __utma.split('.')[5] + '.1.' + (zinfo == '' ? 'utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)' : zinfo);
        }
        Tool.cookie.setCookie("__utmz", __utmz, _xa_config.path, GetDomain(), 365 * 24 * 30);

        data.ref = getReferrer();

        var __utmx = Tool.cookie.getCookie("__utmx");
        if (__utmx && data.ref.indexOf(GetDomain()) == -1 && __utmx != data.ref) {
            __utmx = data.ref;
            Tool.cookie.setCookie("__utmx", data.ref, _xa_config.path, GetDomain(), 30);
        } else if (!__utmx && data.ref.indexOf(GetDomain()) == -1) {
            __utmx = data.ref;
            Tool.cookie.setCookie("__utmx", data.ref, _xa_config.path, GetDomain(), 30);
        }
        var __utmu = Tool.cookie.getCookie("__utmu");
        data.utmcc = '__utma=' + __utma + ';+__utmb=' + __utmb + ';+__utmc=' + __utmc + ';+__utmz=' + __utmz + ';+__utmx=' + (__utmx == null ? '' : __utmx) + ';+__utmu=' + (__utmu == null ? '' : __utmu);
        Tool.cookie.setCookie("xxd_utm_source", getMyUrlParam(), _xa_config.path, GetDomain(), 10 * 365 * 24 * 30);
        return data;
    };


    /**
     * XA Track 构造函数
     * @param params {tid:"" ,type:""}
     *  tid:   touch point 接触点页面、按钮等
     * @constructor
     */
    Track = function (params) {
        if (1 != _xa_config.off) return;
        var json = {
            tid: params.tid
        };
        this.tid = json.tid;

        this.type = Tool.isPC() ? "website" : "webapp";
        this.pid = Tool.uuid() + 10 * Math.random();
        //this.url = (_xa_config.url && _xa_config.url != '') ? _xa_config.url : ('//' + document.domain + '/_xa.gif');
        this.url = "//www.xinxindai.com/_xa.gif";
    };

    /**
     * 设置XA 收集服务地址
     * 默认为：http://www.xinxindai.com/_xa.gif
     * @param url
     */
    Track.prototype.setURL = function (url) {
        this.url = url;
    };

    /**
     * 页面打点
     * param json 调用该函数需要传递的参数集，其分为必选和可选两种
     * page_url : page_url
     * virtual_url: json.virtual_url
     * userid : userid
     * pid: 产品id
     */
    Track.prototype.pageView = function (param) {
        if (1 != _xa_config.off)return;
        var json = {
            page_url: param.page_url || "",
            virtual_url: param.virtual_url || "", //虚拟页面地址
            userid: param.userid || "",      //userid
            pid: param.pid || ""          //产品id
        };

        var model = {
            xv: _xa_config.version,
            geoIP: "",//地理位置
            page_url: "",//当前url
            userid: json.userid || "",//userid
            cookie: document.cookie || "",//
            domain: document.domain || "",//域名
            title: document.title || "",//页面标题
            resolution: screen.width + "x" + screen.height,//分辨率
            color_depth: window.screen.colorDepth || 0,//颜色深度
            language: navigator.language,//客户端语言
            mouse_trajectory: "",//鼠标轨迹
            site: _xa_config.siteid,//PC WEBAPP APP
            device: "",//设备
            brand: "",//设备品牌
            os: "",//系统
            kid: "",//设备号+uuid
            pid: json.pid || "",//产品id
            log: "pv",//跟踪类型pv、event
            category: 'view',//事件类别
            labid: "",//事件id
            label: "",//事件对象
            value: "",//事件值
            cvalue: "",//自定义值
            utmcc: ""
        };

        var self = this, data = null;
        data = Hanlder.websiteHanlder(json);

        model.kid = model.site + '_' + data.kid;
        model.os = navigator.platform;
        model.page_url = location.href;
        if (json.virtual_url != null && json.virtual_url != "") { //虚拟页面
            model.page_url = json.virtual_url;
            model.category = "virtual";
        }
        if (json.page_url != null && json.page_url != "") {  //实际页面
            model.page_url = json.page_url;
        }
        model.page_referer = data.ref;
        model.labid = self.tid != null ? self.tid : model.page_url; //兼容1.0.3版本 labid
        model.utmcc = data.utmcc;

        Tool.request({
            url: self.url,
            type: JSON_TYPE,
            data: model,
            success: function (result) {

            },
            error: function (result) {

            }
        });
    };

    /**
     * 事件打点。注:事件打点依赖于页面打点。
     */
    Track.prototype.eventView = function (param) {
        if (1 != _xa_config.off)return;

        var json = {
            category: param.category,         //事件类别(必填): 如提供注册的地方分类类别为：xa_register
            action: param.action,            //用户行为(必填)：即发生用户行为，如 mobile_register,nickname_register。
            label: param.label || "",       //事件标签(必填)：如类别内文本框、按钮、链接等的名称
            value: param.value || "",       //事件价值(可选)：如注册次数、充值金额、出借金额
            custval: param.custval || ""  //自定义值(可选)。其他值
        };

        var model = {
            xv: _xa_config.version,
            geoIP: "",//地理位置
            page_referer: "",
            page_url: location.href || "",//当前url
            userid: "",//userid
            cookie: document.cookie || "",//
            domain: document.domain || "",//域名
            title: document.title || "",//页面标题
            resolution: screen.width + "x" + screen.height,//分辨率
            color_depth: window.screen.colorDepth || 0,//颜色深度
            language: navigator.language,//客户端语言
            mouse_trajectory: "",//鼠标轨迹
            site: _xa_config.siteid,//PC WEBAPP
            device: "",//设备
            brand: "",//设备品牌
            os: navigator.platform || "",//系统
            kid: "",//设备号+uuid,PC上为_uc_id_
            pid: "",//产品id
            log: "event",//跟踪类型pv、event
            category: json.category || "",
            labid: json.action || "",//事件id
            label: json.label || "",
            value: json.value || "",
            cvalue: json.custval || ""
        };

        var __utma = Tool.cookie.getCookie("__utma");
        var __utmb = Tool.cookie.getCookie("__utmb");
        var __utmc = Tool.cookie.getCookie("__utmc");
        var __utmz = Tool.cookie.getCookie("__utmz");
        var __utmx = Tool.cookie.getCookie("__utmx");
        if (__utma) {
            try {
                model.kid = model.site + '_' + __utma.split('.')[1];
            } catch (e) {
            }
        }
        var self = this;
        model.page_referer = getReferrer();
        model.labid = json.action == null ? self.tid : json.action; //兼容1.0.3版本 labid

        //事件设置userid
        var _utmu = '';
        if (model.labid == 'login_success_webapp' || model.labid == 'login_success_pc' || model.labid == 'reg_success_gophonestep3' || model.labid == 'reg_success_registerstep3' || model.labid == 'reg_success_webapp') {
            _utmu = model.value;
            Tool.cookie.setCookie("__utmu", model.value, _xa_config.path, GetDomain(), -1);
        }
        var __utmu = Tool.cookie.getCookie("__utmu");
        model.utmcc = '__utma=' + (__utma == null ? '' : __utma) + ';+__utmb=' + (__utmb == null ? '' : __utmb) + ';+__utmc=' + (__utmc == null ? '' : __utmc) + ';+__utmz=' + (__utmz == null ? '' : __utmz) + ';+__utmx=' + (__utmx == null ? '' : __utmx) + ';+__utmu=' + (__utmu == null ? _utmu : __utmu);
        if (model.labid == 'logout_success_webapp') {
            Tool.cookie.setCookie("__utmu", "", _xa_config.path, GetDomain(), -1);
            Tool.cookie.delCookie("__utmu");
        }
        Tool.request({
            url: self.url,
            type: JSON_TYPE,
            data: model,
            success: function (result) {

            },
            error: function (result) {

            }
        });
    };

    /**
     * PV跟踪
     * @param tid 接触点：页面地址简称
     * @vesion 1.0.3
     * @private
     */
    Track.track_pageview = function (tid) {
        if (1 != _xa_config.off) return;
        new XXD_TRACK({ tid: tid }).pageView({});
    };

    /**
     * 事件跟踪
     * @param
     *  tid      接触点：        页面/按钮等地址简称
     *  category 事件类别(必填): 如提供注册的地方分类类别为：xa_register
     *  action   用户行为(必填)：即发生用户行为，如 mobile_register,nickname_register
     *  label    事件标签(必填)：如类别内文本框、按钮、链接等的名称
     *  value    事件价值(可选)：如注册次数、充值金额、出借金额
     * @vesion 1.0.3
     * @private
     */
    Track.track_eventview = function (tid, category, label, value) {
        if (1 != _xa_config.off)return;
        new XXD_TRACK({tid: tid}).eventView({category: category, label: label, value: value});
    };

    /**
     * _trackPageview 页面跟踪
     * @param json
     * page_url : page_url 页面地址
     * virtual_url: virtual_url 虚拟页面
     * userid : userid  userid
     * @vesion 1.1.0
     * @private
     */
    Track._trackPageview = function (json) {
        if (1 != _xa_config.off)return;
        new XXD_TRACK({}).pageView(json);
    };

    /**
     * _trackEvent 事件跟踪
     * @param json {category ："", action : "" , label : "", value : "" ,custval : "" }
     *  category 事件类别(必填): 如提供注册的地方分类类别为：xa_register
     *  action   用户行为(必填)：即发生用户行为，如 mobile_register,nickname_register
     *  label    事件标签(必填)：如类别内文本框、按钮、链接等的名称
     *  value    事件价值(可选)：如注册次数、充值金额、出借金额
     *  custval  自定义值(可选)。其他值
     * @vesion 1.1.0
     * @private
     */
    Track._trackEvent = function (json) {
        if (1 != _xa_config.off)return;
        var _json = {};
        new XXD_TRACK({tid: json.action}).eventView(json);
    };

    var XXD_TRACK = Track;

    //所有模块通过 define 来定义
    if (typeof define == "function") {
        define(function (require, exports, module) {
            module.exports = XXD_TRACK;
        });
    }
    window.XXD_TRACK = XXD_TRACK;

    /**
     * PC端PV跟踪页面直接加载
     */
    if (_xa_config.siteid && _xa_config.siteid == 'xa-8859-02') {
        try {
            XXD_TRACK.track_pageview();
        } catch (e) {
        }
    }
})();