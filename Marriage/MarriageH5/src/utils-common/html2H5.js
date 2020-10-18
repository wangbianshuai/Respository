import * as Common from "./common";

export default (html, replaceStrs) => {
    if (Common.isNullOrEmpty(html)) return "";

    const tagList = [];
    html = getTagList(html, tagList, "<", ">");

    tagList.forEach(t => {
        t.matchPxs = t.html.match(/(\d+)px/gi);
        if (t.matchPxs && t.matchPxs.length > 0) {
            t.matchPxs.forEach(m => {
                t.Rem = toRem(m);
                if (t.Rem !== false) t.html = t.html.replace(new RegExp(m, "g"), t.Rem);
            });
        }
        html = html.replace(new RegExp(t.id, "g"), t.html);
    });

    if (replaceStrs) {
        for (let key in replaceStrs) {
            while (html.indexOf(key) >= 0) {
                html = html.replace(key, replaceStrs[key]);
            }
        }
    }

    return html;
};

function toRem(px) {
    if (!px) return false;
    px = px.toLowerCase().replace(/px/g, "");
    const v = Common.getFloatValue(px);
    if (v > 0) {
        const rv = v * 32 / 16;
        return parseFloat((rv * 1.0000) / 32).toFixed(4) + "rem";
    }
    return false;
}

function getTagList(content, tagList, startTag, endTag) {
    //相应字符变成小写，以便于不区别大小写
    var toLowerConent = content.toLowerCase();
    var toLowerStartTag = startTag.toLowerCase();
    var toLowerEndTag = endTag.toLowerCase();
    //开始索引位置
    var startIndex = 0;
    //结束索引位置
    var endIndex = 0;
    //标签
    var tag;
    while (startIndex >= 0) {
        startIndex = toLowerConent.indexOf(toLowerStartTag, startIndex);
        if (startIndex >= 0) {
            endIndex = toLowerConent.indexOf(toLowerEndTag, startIndex);
            if (endIndex > 0) {
                const html = content.substring(startIndex, endIndex + endTag.length);
                if (html.toLowerCase().indexOf("style") > 0 && html.toLowerCase().indexOf("px") > 0) {
                    //初始对象
                    tag = {};
                    tag.html = html
                    tag.id = Common.createGuid();
                    tagList.push(tag);

                    content = content.replace(tag.html, tag.id);

                    //更新开始索引位置
                    startIndex += 36;
                    toLowerConent = content.toLowerCase();
                }
                else startIndex = endIndex + endTag.length;
            }
        }
    }
    return content;
}