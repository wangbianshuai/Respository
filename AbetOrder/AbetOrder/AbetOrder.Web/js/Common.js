//通用类
function Common() { }

//按钮变灰
Common.ButtonEnabled = function (buttonID, enabled) {
    if (enabled) {
        $("#" + buttonID).css("filter", "");
        $("#" + buttonID).css("-moz-opacity", "");
        $("#" + buttonID).css("-moz-opacity", "");
        $("#" + buttonID).css("color", "#000");
        $("#" + buttonID).attr("disabled", false);
    }
    else {
        $("#" + buttonID).css("filter", "alpha(opacity=70)");
        $("#" + buttonID).css("-moz-opacity", "0.7");
        $("#" + buttonID).css("-moz-opacity", "0.7");
        $("#" + buttonID).css("color", "gray");
        $("#" + buttonID).attr("disabled", true);
    }
};

Common.SetButtonEnabled = function (button, enabled) {
    if (enabled) {
        button.attr("disabled", false);
        button.removeClass("ui-state-disabled");
    }
    else {
        button.attr("disabled", true);
        button.removeClass("ui-state-disabled");
        button.addClass("ui-state-disabled");
    }
};

Common.GetDisabledValue = function (obj) {
    var disabled = obj.attr("disabled");
    if (String.IsNullOrEmpty(disabled)) {
        return false;
    }
    if (disabled.toString().toLowerCase() == "true") {
        return true;
    }
    else if (disabled.toString().toLowerCase() == "disabled") {
        return true;
    }
    return false;
};

//获取本地缓存
Common.GetStorage = function (key) {
    if (window.localStorage == undefined) {
        return "";
    }
    var value = "";
    value = localStorage.getItem(key);
    if (String.IsNullOrEmpty(value)) {
        value = "";
    }
    return value;
};
//设置本地缓存
Common.SetStorage = function (key, value) {
    if (window.localStorage == undefined) {
        return;
    }
    localStorage.setItem(key, value);
};
//移除本地缓存
Common.RemoveStorage = function (key) {
    if (window.localStorage == undefined) {
        return;
    }
    localStorage.removeItem(key);
};
//清空本地缓存
Common.ClearStorage = function () {
    if (window.localStorage == undefined) {
        return;
    }
    localStorage.clear();
};

Common.GetUrl = function (url) {
    if (url.indexOf("?") > 0) {
        return url + "&random=" + Math.random();
    }
    else {
        return url + "?random=" + Math.random();
    }
};

Common.GetPageQueryString = function () {
    var args = new Object();
    var query = location.search.substring(1); //获取查询串   
    var pairs = query.split("&"); //在逗号处断开   
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); //查找name=value   
        if (pos == -1) continue; //如果没有找到就跳过   
        var argname = pairs[i].substring(0, pos); //提取name   
        var value = pairs[i].substring(pos + 1); //提取value   
        args[argname] = unescape(value); //存为属性(解码) 
    }
    return args;
};

Common.GetUrlParameter = function (url) {
    var args = new Object();
    var index = url.indexOf('?');
    if (index > 0) {
        var query = url.substring(index + 1); //获取查询串   
        var pairs = query.split("&"); //在逗号处断开   
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); //查找name=value   
            if (pos == -1) continue; //如果没有找到就跳过   
            var argname = pairs[i].substring(0, pos); //提取name  
            var value = pairs[i].substring(pos + 1); //提取value   
            args[argname] = unescape(value); //存为属性(解码) 
        }
    }
    return args;
};

Common.ShowModelDialog = function (url, width, height) {
    var winSettings = "center:yes;resizable:no;dialogHeight:" + height.toString() + "px;dialogWidth=" + width.toString() + "px;status:no;toolbar=no;help:no;";
    var varModel = window.showModalDialog(Common.GetUrl(url), window, winSettings);
    return varModel;
};

var openWindow;

Common.WindowOpenPage = function (url, width, height) {
    if (openWindow) {
        if (!openWindow.closed) {
            openWindow.close();
        }
    }
    if (width > 0 && height > 0) {
        var iTop = (window.screen.availHeight - 30 - height) / 2;
        var iLeft = (window.screen.availWidth - 10 - width) / 2;
        openWindow = window.open(Common.GetUrl(url), "", 'height=' + height + ',innerHeight=' + height + ',width=' + width + ',innerWidth=' + width + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
    }
    else {
        window.open(Common.GetUrl(url));
    }
};

Common.AddURLParameter = function (url, name, value) {
    if (url.indexOf("?") > 0) {
        return url += "&" + name + "=" + escape(value);
    }
    else {
        return url += "?" + name + "=" + escape(value);
    }
};

//判断是否空值
Common.JudgeNullValue = function (id, message) {
    if (String.IsNullOrEmpty($("#" + id).val())) {
        alert2(message);
        return false;
    }
    return true;
};

//获取内容中标签集合
Common.GetTagList = function (content, startTag, endTag) {
    //相应字符变成小写，以便于不区别大小写
    var toLowerConent = content.toLowerCase();
    var toLowerStartTag = startTag.toLowerCase();
    var toLowerEndTag = endTag.toLowerCase();
    //开始索引位置
    var startIndex = 0;
    //结束索引位置
    var endIndex = 0;
    //标签JSON集合
    var tagList = [];
    //标签JSON
    var tag;
    while (startIndex >= 0) {
        startIndex = toLowerConent.indexOf(toLowerStartTag, startIndex);
        if (startIndex >= 0) {
            endIndex = toLowerConent.indexOf(toLowerEndTag, startIndex);
            if (endIndex > 0) {
                //初始JSON对象
                tag = {};
                tag.TagHtml = content.substring(startIndex, endIndex + endTag.length);
                tag.StartIndex = startIndex;
                tag.EndIndex = endIndex + endTag.length;
                var replaceHtml = "{#=" + startIndex.toString();
                var iHtmlLength = tag.TagHtml.toString().length - replaceHtml.length - 1;
                for (var i = 1; i <= iHtmlLength; i++) {
                    replaceHtml += "1";
                }
                replaceHtml += "}";
                tag.TagReplaceHtml = replaceHtml;  //标签替换后HTML
                tag.TagResolveHtml = null; //标签解析后HTML
                tag.StartTag = startTag;
                tag.EndTag = endTag;
                //将JSON对象添加到相应的集合
                tagList.push(tag);
                //更新开始索引位置
                startIndex = endIndex + endTag.length;
            }
        }
    }
    return tagList;
};

//获取标签字符
Common.GetTagString = function (content, startTag, endTag) {
    //相应字符变成小写，以便于不区别大小写
    var toLowerConent = content.toLowerCase();
    var toLowerStartTag = startTag.toLowerCase();
    var toLowerEndTag = endTag.toLowerCase();
    //开始索引位置
    var startIndex = 0;
    //结束索引位置
    var endIndex = 0;
    var str = "";
    startIndex = toLowerConent.indexOf(toLowerStartTag, startIndex);
    if (startIndex >= 0) {
        endIndex = toLowerConent.indexOf(toLowerEndTag, startIndex);
        if (endIndex > 0) {
            str = content.substring(startIndex, endIndex + endTag.length);
        }
    }
    return str;
};

//获取标签中属性值
Common.GetTagPropertyValue = function (content, propertyName) {
    //相应字符变成小写，以便于不区别大小写
    var toLowerConent = content.toLowerCase();
    propertyName = propertyName.toLowerCase();
    //开始索引位置
    var startIndex = 0;
    //结束索引位置
    var endIndex = 0;
    var propertyValue = "";
    var tagChar = "";
    //属性名位置
    startIndex = toLowerConent.indexOf(propertyName, startIndex);
    if (startIndex >= 0) {
        //等号位置
        startIndex = toLowerConent.indexOf("=", startIndex);
        if (startIndex > 0) {
            //双引号位置
            endIndex = toLowerConent.indexOf("\"", startIndex);
            if (endIndex < 0) {
                //单引号位置
                endIndex = toLowerConent.indexOf("'", startIndex);
                if (endIndex - startIndex > 1) {
                    //等号与引号之间为空
                    if (content.substring(startIndex + 1, endIndex - 1).Trim() == "") {
                        tagChar = "'";
                    }
                }
                else {
                    tagChar = "'";
                }
            }
            else {
                if (endIndex - startIndex > 1) {
                    //等号与引号之间为空
                    if (content.substring(startIndex + 1, endIndex - 1).Trim() != "") {
                        //单引号位置
                        endIndex = toLowerConent.indexOf("'", startIndex);
                        if (endIndex - startIndex > 1) {
                            //等号与引号之间为空
                            if (content.substring(startIndex + 1, endIndex - 1).Trim() == "") {
                                tagChar = "'";
                            }
                        }
                        else {
                            tagChar = "'";
                        }
                    }
                    else {
                        tagChar = "\"";
                    }
                }
                else {
                    tagChar = "\"";
                }
            }
            if (tagChar != "") {
                startIndex = toLowerConent.indexOf(tagChar, startIndex);
                endIndex = toLowerConent.indexOf(tagChar, startIndex + 1);
                if (startIndex >= 0 && endIndex >= 0) {
                    propertyValue = content.substring(startIndex + 1, endIndex).Trim();
                }
            }
        }
    }
    return propertyValue;
};

//获取规换内容
Common.GetReplaceContent = function (content, tag) {
    return content.replace(content.substring(tag.StartIndex, tag.EndIndex), tag.TagReplaceHtml);
};

Common.GetEntityName = function (url) {
    var entityName = "";
    if (url.indexOf('/') > 0) {
        entityName = url.split('/')[0];
    }
    else if (url.indexOf('?') > 0) {
        entityName = url.substring(0, url.indexOf('?'));
    }
    else {
        entityName = url;
    }
    return entityName;
};

Common.IsFirefox = function () {
    var reg = new RegExp("firefox");
    return reg.test(navigator.userAgent.toLowerCase());
};

Common.RootPath = String();

Common.GetRootPath = function () {
    if (!String.IsNullOrEmpty(Common.RootPath)) {
        return Common.RootPath;
    }

    return Common.RootPath;
};

Common.RemoveWhiteSpaces = function (str) {
    if (String.IsNullOrEmpty(str)) {
        return "";
    }
    str = str.toString().Trim();
    while (str.indexOf('  ') > 0) {
        str = str.replace(/  /g, " ");
    }
    return str;
};

//获取位置  
Common.GetTextLocationIndex = function (element) {
    if (element.createTextRange) {
        var range = document.selection.createRange();
        range.setEndPoint('StartToStart', element.createTextRange());
        return range.text.length;
    }
    else if (element.selectionStart) {
        return element.selectionStart;
    }
    return String.IsNullOrEmpty(element.value) ? 0 : element.value.length;
};

//设置位置  
Common.SetTextLocationIndex = function (element, index) {
    if (String.IsNullOrEmpty(element.value) || index >= element.value.length) {
        return;
    }
    if (element.createTextRange) {
        var textRange = element.createTextRange();
        textRange.moveStart('character', index);
        textRange.collapse();
        textRange.select();
    }
    else if (element.setSelectionRange) {
        element.setSelectionRange(index, index);
        element.focus();
    }
};

window.alert2 = function (message, callback) {
    Common.AlertOrConfirm(message, callback, false);
};

window.confirm2 = function (message, callback) {
    Common.AlertOrConfirm(message, callback, true);
};

Common.AlertOrConfirm = function (message, callback, blconfirm) {
    message = String.IsNullOrEmpty(message) ? "" : message.toString();
    var id = Guid.NewGuid();

    if ($("#" + id).dialog === undefined) {
        alert(message);
        return;
    }

    message = message.replace(/</g, "&lt;");
    message = message.replace(/>/g, "&gt;");
    var warnSrc = blconfirm ? "images/confirm.png" : "images/warn.png";
    warnSrc = Common.GetRootPath() + warnSrc;
    var html = [];
    html.push(String.Format("<div id=\"{0}\" style=\"display:none;\" title=\"{1}\">", [id, blconfirm ? "确认信息" : "提示信息"]));
    html.push("<table class=\"Alert\" border=\"0\"cellpadding=\"0\" cellspacing=\"0\"><tr align=\"left\">");
    html.push(String.Format("<td valign=\"top\" width=\"40px\"><div class=\"Img\"><img src=\"{0}\" border=\"0\"/></div></td>", [warnSrc]));
    html.push(String.Format("<td valign=\"top\"><div class=\"Text\"><span>{0}</span></div></td>", [message]));
    html.push("</tr></table></div>");
    $(document.body).append(html.join(""));
    var buttons = {};
    var okButton = {};
    buttons["确定"] = function () {
        if (blconfirm && callback != undefined) {
            callback();
        }
        $(this).dialog("close");
    };

    if (blconfirm) {
        buttons["取消"] = function () {
            $(this).dialog("close");
        };
    }

    var width = 300;
    var height = 200;

    var width1 = message.length * 15;
    if (width1 > 500) {
        width = 500;
        height = 250;
    }
    else if (width1 > width) {
        width = width1;
    }


    $("#" + id).dialog({
        autoOpen: false,
        resizable: false,
        height: height,
        width: width,
        modal: true,
        buttons: buttons,
        close: function () {
            if (!blconfirm && callback != undefined) {
                callback();
            }
            $(this).remove();
        }
    });

    $("#" + id).parent().find("button span").each(function () {
        if ($(this).text() == "确定") {
            okButton = $(this).parent();
            return false;
        }
    });

    okButton.keypress = function (e) {
        var key = window.event ? e.keyCode : e.which;
        if (key == 13) {
            $(this).click();
        }
    };

    window.setTimeout(function () {
        okButton.focus();
        $("#" + id).dialog("open");
    }, 100);
};

//去掉空格与回车
Common.RemoveWhiteEnter = function (str) {
    str = str.replace(/\n/g, "");
    while (str.indexOf("  ") >= 0) {
        str = str.replace(/  /g, " ");
    }
    return str.Trim();
};

Common.GetTagObject = function (tagId) {
    return typeof (tagId) == "string" ? $("#" + tagId) : tagId;
};

Common.GetObjValue = function (obj, name, defaultValue) {
    if (!Object.IsObject(obj) || String.IsNullOrEmpty(name)) return defaultValue

    for (var key in obj) if (key.toLowerCase() === name.toLowerCase()) return obj[key]

    return defaultValue
};