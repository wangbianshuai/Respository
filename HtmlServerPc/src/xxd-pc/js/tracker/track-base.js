;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.trackBase = factory();
    }
}(this, function() {
    'use strict';
    var trackBase = (function() {
        var window = (function () {
            if (typeof self !== 'undefined') { return self; }
            if (typeof window !== 'undefined') { return window; }
            if (typeof global !== 'undefined') { return global; }
            throw new Error('unable to locate global object');
        })();
        var userId = window["userId"]||"";// for seed.js
        var my = {
            createXHR : function(){
                if(window.XMLHttpRequest){
                    //IE7+、Firefox、Opera、Chrome 和Safari
                    return new XMLHttpRequest();
                }else if(window.ActiveXObject){
                    //IE6 及以下
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }else{
                    throw new Error('浏览器不支持XHR对象！');
                }
            },
            ajax : function(){
                var arg = arguments[0]
                var ajaxData = {
                    type: arg.type || "GET",
                    url: arg.url || "",
                    processData: arg.processData || true,
                    async: arg.async || "true",
                    data: arg.data || null,
                    cache: arg.cache || null,
                    // dataType: arg.dataType || "text",
                    contentType: arg.contentType,
                    beforeSend: arg.beforeSend || function(){},
                    success: arg.success || function(){},
                    error: arg.error || function(){},
                    done: arg.done || function(){}
                }
                ajaxData.beforeSend()
                var xhr = this.createXHR();
                // xhr.responseType=ajaxData.dataType;
                xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);
                if(ajaxData.contentType){
                    xhr.setRequestHeader("Content-Type",ajaxData.contentType);
                }
                xhr.setRequestHeader("cache-control",ajaxData.cache);
                xhr.send(ajaxData.data);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200){
                            ajaxData.success(xhr.response)
                        }else{
                            ajaxData.error()
                        }
                        ajaxData.done()
                    }
                }
            },
            convertData : function(obj){
                var data = obj.data;
                var processData = obj.processData;
                if( !(typeof data === 'object')){
                    return data;
                }
                var convertResult = "" ;
                for(var c in data){
                    convertResult+= c + "=" + data[c] + "&";
                }
                convertResult=convertResult.substring(0,convertResult.length-1)
                return convertResult;
            }
        };
        var commonPlugin = {
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
            isEmptyObject: function( obj ) {
                var name;
                for ( name in obj ) {
                    return false;
                }
                return true;
            },
            parseObject: function (data) {
                return ( new Function("return " + data) )();
            },
            addHandle: function(element, type, handler){
                var doc = document.body
                if(doc.addEventListener){
                    doc.addEventListener(type, function(event) {
                        var targets = Array.prototype.slice.call(doc.querySelectorAll(element));
                        var target = event.target;
                        if (targets.indexOf(target) != -1) {
                            return handler.apply(target, arguments);
                        }
                    }, false);
                }else if(doc.attachEvent){
                    doc.attachEvent('on' + type, function(event) {
                        var targets = Array.prototype.slice.call(doc.querySelectorAll(element));
                        var target = event.target;
                        if (targets.indexOf(target) != -1) {
                            return handler.apply(target, arguments);
                        }
                    });
                }else{
                    element['on' + type] = handler
                }
            }
        }
        return {
            getBrowser:function(){
                var _hasCss = function (val) {
                    var b = document.getElementsByClassName("_C_wrapTrack") , len;
                    if (!(len = b.length)) {
                        b = document.createElement('div');
                        b.style.cssText="position:absolute;left:-9999px;";
                        b.setAttribute("class" , "_C_wrapTrack");
                    } else {
                        b = b[0];
                    }
                    b.innerHTML = '<div id="_J_track" style="'+val+'border-radius:100px;"></div>';
                    if ( !len ) {
                        document.getElementsByTagName("body")[0].appendChild(b);
                    }
                    return document.getElementById("_J_track").style.borderRadius;
                }
                if (!window) return;
                if (!!window["VBArray"]) {//vb
                    return "ie";
                } else if (!!window["chrome"]) {//chrome
                    return "chrome";
                } else if (!!window["updateCommands"]) {//ff
                    return "ff";
                } else if (!!window["openDatabase"] && !window["chrome"]) {//safari
                    return "safari";
                } else if (_hasCss("-o-")) {//o
                    return "o";
                }
            },
            gaInit:function (id) {
                (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function () {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
                var gaUrl = document.referrer;
                if (gaUrl == "") {
                    gaUrl = window.location.href;
                }
                userId = id||userId;
                ga('create', 'UA-55539630-1', 'auto', {'userId': userId});
                ga('require', 'linkid', 'linkid.js');
                ga('require', 'displayfeatures');
                ga('require', 'ec');
                ga('set', 'dimension2', userId);
                ga("set", "dimension3", "web");
                ga('set', 'dimension4', gaUrl);
                ga(function (tracker) {
                    ga('set', 'dimension6', tracker.get('clientId'));
                });
                ga('set', 'transport', 'beacon');//将 'beacon' 指定为 transport 机制
                ga('send', 'pageview');//发送页面浏览量
            },
            gtmInit:function (){
                // 加载初始化GTM
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-PRZHDF');
            },
            BaiduPush:function () {
                (function(){
                    var bp = document.createElement('script');
                    var curProtocol = window.location.protocol.split(':')[0];
                    if (curProtocol === 'https') {
                        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
                    }
                    else {
                        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
                    }
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(bp, s);
                })();
            },
            BaiduHm:function () {
                var _hmt = _hmt || [];
                (function() {
                    var hm = document.createElement("script");
                    hm.src = "https://hm.baidu.com/hm.js?189e41b9b5d3f288cad1459403f7a245";
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(hm, s);
                })();
            },
            dmpInit:function () {
                var interfacePath = "",
                    ret = {};
                ret.dmp_userId = "";
                ret.dmp_userToken = "";
                if(commonPlugin.readCookie('ID')){
                    ret.dmp_userId = commonPlugin.readCookie('ID');
                }
                if(commonPlugin.readCookie('Token')){
                    ret.dmp_userToken = commonPlugin.readCookie('Token');
                }else if(commonPlugin.readCookie('userToken')){
                    ret.dmp_userToken = commonPlugin.readCookie('userToken');
                }
                var _dmp_sessionId = new Date().getTime() + String(randomNum(4));
                if(!commonPlugin.readCookie('_dmp_sessionId')){
                    commonPlugin.createCookie("_dmp_sessionId",_dmp_sessionId,"1825");
                }
                var dmp_utm_source = getDmpUrlParam("utm_source") || "";
                if(!commonPlugin.readCookie('dmp_utm_source') || dmp_utm_source){
                    commonPlugin.createCookie("dmp_utm_source",dmp_utm_source,"1");
                }
                var locationString = window.location.href;
                if(window.location.host == "www.xinxindai.com"||window.location.host == "m.xinxindai.com"){
                    if (locationString.indexOf("xinxindai.com/jie/")>=0) {
                        interfacePath = "https://dmp.xinxindai.com/dmp_jie/collect";
                    } else {
                        interfacePath = "https://dmp.xinxindai.com/dmp_web/collect";
                    }
                }else{
                    if (locationString.indexOf("/jie/")>=0) {
                        interfacePath = "http://118.178.90.205/dmp_jie/collect";
                    } else {
                        interfacePath = "http://118.178.90.205/dmp_web/collect";
                    }
                }
                ret.getReferrer = function() {
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
                };
                function randomNum(n){
                    var t='';
                    for(var i=0;i<n;i++){
                        t+=Math.floor(Math.random()*10);
                    }
                    return t;
                };
                function getDmpUrlParam(items){
                    var pattern = new RegExp("[?&]"+ items +"\=([^&]+)", "g");
                    var matcher = pattern.exec(decodeURIComponent(location.href));
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
                    return items;
                }
                ret.sendRequest = function() {
                    if(window.FormData && typeof window.FormData == 'function') {
                        var form = new FormData(),
                            self = this;
                        form.append('dmp_default', this.defaultString);
                        form.append("dmp_data", this.dataString);
                        this.settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": interfacePath,
                            "type": "POST",
                            cache: "no-cache",
                            "contentType": false,
                            "data": form
                        };
                        my.ajax(self.settings)
                    }else {
                        var form = {},
                            self = this,
                            dmpUrl = "http://" + window.location.host + "/dmp/dmp_web/collect";
                        form.dmp_default = this.defaultString;
                        form.dmp_data = this.dataString;
                        form = JSON.stringify(form);
                        my.ajax({
                            "async": true,
                            "contentType": "application/json",
                            "url":dmpUrl,
                            "type":"post",
                            "data":form,
                            success:function(response){
                                // console.log(response);
                            },
                            error:function(data){
                            }
                        });
                    }
                };
                ret.clickDmpEvent = function(dmp_data) {
                    this.defaultJSON = {
                        'type':'web',
                        'uid':this.dmp_userToken,
                        'channel':commonPlugin.readCookie('dmp_utm_source'),
                        'sid':commonPlugin.readCookie('_dmp_sessionId'),
                        'ua':window.navigator.userAgent,
                        'path':window.location.href,
                        'refere':this.getReferrer(),
                        'ts':new Date().getTime(),
                        'v':'v1.0.0'
                    };
                    this.defaultString = JSON.stringify(this.defaultJSON);
                    this.dataString = JSON.stringify(dmp_data);
                    this.sendRequest();
                };
                ret.clickDmpEvent(dmp_default_obj("browse","refresh"));
                commonPlugin.addHandle('.dmp-click', 'click', function(e){
                    var _this = e.target
                    var eventType = _this.getAttribute('eventType') || _this.getAttribute('eventtype');
                    var dev_id = _this.getAttribute('dev_id');
                    var target_id = _this.getAttribute("target_id");
                    var textHref = _this.getAttribute("textHref");
                    var dmp_text =  _this.getAttribute("dmp_text");
                    var xxd_utm_source = getDmpUrlParam("xxd_utm_source") || "";
                    var dmp_action =  _this.getAttribute("dmp_action") || 'click';
                    ret.clickDmpEvent(dmp_data_obj(dmp_action,eventType,dev_id,target_id,textHref,dmp_text,xxd_utm_source));
                })
                function  dmp_data_obj(action,event,dev_id,target_id,textHref,dmp_text,xxd_utm_source) {
                    var dmp_data_obj = {};
                    dmp_data_obj.action = action;
                    dmp_data_obj.event = event;
                    dmp_data_obj.dev_id = dev_id;
                    dmp_data_obj.target_id = {};
                    if(target_id != null && target_id!= "" && target_id != undefined){
                        dmp_data_obj.target_id.id = target_id;
                    }
                    if(textHref != null && textHref!= "" && textHref != undefined){
                        dmp_data_obj.target_id.textHref = textHref;
                    }
                    if(dmp_text != null && dmp_text!= "" && dmp_text != undefined){
                        dmp_data_obj.target_id.text = dmp_text;
                    }
                    if(xxd_utm_source != null && xxd_utm_source!= "" && xxd_utm_source != undefined){
                        dmp_data_obj.xxd_utm_source = xxd_utm_source;
                    }
                    return dmp_data_obj;
                }
                function  dmp_default_obj(action,event) {
                    var dmp_default_obj = {};
                    dmp_default_obj.action = action;
                    dmp_default_obj.event = event;
                    return dmp_default_obj;
                }
            },
            eventGATrack:function (e){
                var _this = e
                var hitType = _this.getAttribute("ga-hitType")||"event";
                var category = _this.getAttribute("ga-category");
                var _action = _this.getAttribute("ga-action");
                var label = _this.getAttribute("ga-label");
                var _value = _this.getAttribute("ga-value");
                var fieldsObject = {};
                if (hitType && category && _action) {
                    fieldsObject = {
                        hitType:hitType,
                        eventCategory:category,
                        eventAction:_action
                    };
                    if (label) {
                        if (label=="ga-url") label = location.href;
                        fieldsObject["eventLabel"] = label;
                    }
                    if (_value) fieldsObject["eventValue"] = _value;
                }
                var commands = (_this.getAttribute("ga-commnd")||"").split(/,/g);
                for (var i = 0 , j =  commands.length; i < j; i++){
                    if (commands[i]=="ec:addPromo") {
                        var promo = _this.getAttribute("ga-ec-addPromo");
                        var promoJSON= commonPlugin.parseObject(promo);
                        if (!commonPlugin.isEmptyObject(promoJSON)) ga("ec:addPromo",promoJSON);
                    } else if (commands[i]=="ec:addProduct") {
                        var product = _this.getAttribute("ga-ec-addProduct");
                        var productJSON = commonPlugin.parseObject(product);
                        if (!commonPlugin.isEmptyObject(productJSON)) ga("ec:addProduct",productJSON);
                    } else if (commands[i]=="ec:setAction") {
                        var action = _this.getAttribute("ga-ec-setAction");
                        var actionCommand = _this.getAttribute("ga-ec-setAction-command");
                        if ( actionCommand ) {
                            var actionJSON = commonPlugin.parseObject(action);
                            if (actionJSON) ga("ec:setAction",actionCommand,actionJSON);
                            else ga("ec:setAction",actionCommand);
                        }
                    }
                }
                if (!commonPlugin.isEmptyObject(fieldsObject))  ga("send" , fieldsObject);
            },
            showGA:function (className) {
                var base = this;
                var eventClass = className||".ga-show";
                var ul = document.querySelectorAll(eventClass)
                for(var i=0; i<ul.length; i++){
                    base.eventGATrack(ul[i]);
                }
            },
            clickGA:function (){
                var base = this;
                commonPlugin.addHandle('.ga-click', 'click', function(e) {
                    base.eventGATrack(e.target);
                })
            },
            init:function (userDO){
                var me = this;
                var id = userDO && userDO.userId;
                me.gaInit(id) ,
                    me.showGA(),
                    me.clickGA() ,
                    // me.growingIO(userDO) ,
                    me.gtmInit(),
                    me.BaiduPush(),
                    me.BaiduHm(),
                    me.dmpInit();
            }
        };
    })()
    return trackBase;
}));