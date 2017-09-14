((ns) => {
    const { Common } = ns.utils

    ns.utils.HtmlTag = class HtmlTag {

        static GetById(id) {
            return document.getElementById(id)
        }

        static SetHtml(ele, html) {
            if (ele && html !== undefined) {
                ele.innerHTML = html
            }
        }

        static BindEvent(ele, eventName, fn, blUnbind) {
            if (!ele) return;

            let eventNames = eventName.split(".");
            let name = "";
            if (eventNames.length === 2) {
                eventName = eventNames[0];
                name = eventNames[1];
            }
            else {
                name = eventName;
            }

            if (ele["Event_" + eventName] === undefined) {
                ele["Event_" + eventName] = {
                    EventAction: (e) => {
                        let rv = true, rv2 = null
                        eventObj.EventList.forEach(ev => { rv2 = ev.Action(e); if (rv2 === false) rv = rv2; })
                        if (rv === false) { e.preventDefault(); e.returnValue = rv; e.cancel = !rv; }
                    },
                    EventList: []
                };
            }

            let eventObj = ele["Event_" + eventName];

            if (blUnbind) {
                if (eventObj.EventList.length === 1) {
                    HtmlTag.RemoveEvent(ele, eventName, eventObj.EventAction)
                    eventObj.EventList = [];
                }
                else {
                    let index = -1;
                    for (let i = 0; i < eventObj.EventList.length; i++) {
                        if (eventObj.EventList[i].Name === name) { index = i; break; }
                    }
                    if (index >= 0) eventObj.EventList.splice(index, 1);
                }
            }
            else {
                let list = eventObj.EventList.filter(f => f.Name === name);
                list.length === 0 && eventObj.EventList.push({ Name: name, Action: fn });

                if (eventObj.EventList.length === 1) HtmlTag.AddEvent(ele, eventName, eventObj.EventAction);
            }
        }

        static OffBindEvent(ele, eventName) {
            HtmlTag.BindEvent(ele, eventName, null, true);
        }

        static AddEvent(ele, eventName, fn) {
            if (ele.addEventListener) {
                ele.addEventListener(eventName, fn, false)
            }
            else if (ele.attachEvent) {
                ele.attachEvent('on' + eventName, fn)
            }
            else {
                ele["on" + eventName] = fn
            }
        }

        static RemoveEvent(ele, eventName, fn) {
            if (ele.detachEvent) {
                ele.detachEvent('on' + eventName, fn)
            }
            else if (ele.removeEventListener) {
                ele.removeEventListener(eventName, fn, false)
            }
            else {
                ele["on" + eventName] = null
            }
        }

        static SetAttribute(ele, name, value) {
            ele && ele.setAttribute && ele.setAttribute(name, value);
        }

        static GetAttribute(ele, name) {
            if (ele && ele.getAttribute) return ele.getAttribute(name)
            return null
        }

        static GetElement(ele) {
            return typeof (ele) === "string" ? HtmlTag.GetById(ele) : ele
        }

        static GetValue(ele) {
            ele = HtmlTag.GetElement(ele)
            if (ele && ele.value) return Common.Trim(ele.value);
            return ""
        }

        static SetValue(ele, value) {
            ele = HtmlTag.GetElement(ele)
            if (ele) ele.value = value
        }

        static SetDisabled(ele, disabled) {
            ele = HtmlTag.GetElement(ele)
            if (ele) ele.disabled = disabled
        }

        static GetDisabled(ele) {
            ele = HtmlTag.GetElement(ele)
            if (ele) return ele.disabled
            return false
        }

        static Find(ele, tags) {
            if (!ele || !tags || !ele.hasChildNodes()) return null

            let tagList = tags.split(">")
            const tagName = tagList[0]
            tagList.splice(0, 1)

            let childList = []

            let c = null;
            for (let i = 0; i < ele.childNodes.length; i++) {
                c = ele.childNodes[i];
                if (c.nodeName.toLowerCase() === tagName.toLowerCase()) childList.push(c);
            }

            if (tagList.length > 0) {
                tags = tagList.join(">")
                let childList2 = [], list = null

                childList.forEach((c) => {
                    list = HtmlTag.Find(c, tags)
                    if (list != null) childList2 = childList2.concat(list)
                })

                return childList2
            }
            else {
                return childList
            }
        }

        static AppendHtml(ele, html) {
            var div = document.createElement("div")
            HtmlTag.SetHtml(div, html)
            while (div.childNodes.length > 0) {
                ele.appendChild(div.childNodes[0])
            }
        }

        static GetElementsByTagName(ele, tagName) {
            return ele && ele.getElementsByTagName(tagName);
        }

        static SetHide(ele) {
            if (ele && ele.style) ele.style.display = "none"
        }

        static SetShow(ele) {
            if (ele && ele.style) ele.style.display = ""
        }

        static GetBodyWidth() {
            return document.body.offsetWidth
        }

        static GetWindowWidth() {
            return window.screen.availWidth;
        }

        static GetBodyHeight() {
            return document.body.offsetHeight
        }

        static GetWindowHeight() {
            return window.screen.availHeight;
        }

        static GetWindowWidth() {
            return window.innerWidth
        }

        static GetWindowHeight() {
            return window.innerHeight
        }

        static GetWidth(ele) {
            if (ele && ele.style) {
                if (ele.style.width === "") {
                    return ele.parentNode !== null ? HtmlTag.GetWidth(ele.parentNode) : HtmlTag.GetBodyWidth()
                }
                else if (ele.style.width.indexOf("%") > 0) {
                    return HtmlTag.GetWidth(ele.parentNode) * parseFloat(ele.style.width) / 100
                }
                else {
                    return parseFloat(ele.style.width)
                }
            }
            return ele.body ? HtmlTag.GetBodyWidth() : 0
        }

        static SetWidth(ele, width) {
            if (ele && ele.style) {
                let w = parseFloat(width);
                if (!isNaN(w)) ele.style.width = w.toString() + "px"
            }
        }

        static GetHeight(ele) {
            if (ele && ele.style) {
                if (ele.style.height === "") {
                    return ele.parentNode !== null ? HtmlTag.GetHeight(ele.parentNode) : HtmlTag.GetBodyHeight()
                }
                else if (ele.style.height.indexOf("%") > 0) {
                    return HtmlTag.GetHeight(ele.parentNode) * parseFloat(ele.style.height) / 100
                }
                else {
                    return parseFloat(ele.style.height)
                }
            }
            return ele.body ? HtmlTag.GetBodyHeight() : 0
        }

        static SetHeight(ele, height) {
            if (ele && ele.style) {
                let w = parseFloat(height);
                if (!isNaN(w)) ele.style.height = w.toString() + "px"
            }
        }

        static SetStyle(ele, style) {
            if (ele && ele.style && style) {
                for (var key in style) {
                    ele.style[key] = style[key]
                }
            }
        }

        static SetStyleValue(ele, key, value) {
            if (ele && ele.style) {
                ele.style[key] = value
            }
        }

        static RemoveClass(ele, className) {
            if (ele && ele.className !== undefined) {
                ele.className = Common.Trim(ele.className.replace(new RegExp(className, "g"), "").replace(new RegExp("  ", "g"), ""))
            }
        }

        static AddClass(ele, className) {
            if (ele && ele.className !== undefined) {
                let cn = Common.Trim(ele.className).replace(new RegExp(className, "g"), "").replace(new RegExp("  ", "g"), "")
                cn = cn + " " + className
                ele.className = Common.Trim(cn)
            }
        }

        static RemoveElement(parentNode, ele) {
            if (parentNode && ele && parentNode.removeChild && parentNode.hasChildNodes) {
                if (parentNode.contains) {
                    parentNode.contains(ele) && parentNode.removeChild(ele);
                }
                else {
                    let blExists = false;
                    for (let i = 0; i < parentNode.childNodes.length; i++) {
                        if (parentNode.childNodes[i] === ele) {
                            blExists = true;
                            break;
                        }
                    }
                    if (blExists) parentNode.removeChild(ele);
                }
            }
        }

        static GetOffSet(ele) {
            if (ele) {
                let topLeft = HtmlTag.GetTopLeft(ele.parentNode)

                return {
                    top: ele.offsetTop + topLeft.top,
                    left: ele.offsetLeft + topLeft.left,
                    width: ele.offsetWidth,
                    height: ele.offsetHeight
                }
            }
            return null
        }

        static GetTopLeft(ele, topLeft) {
            topLeft = topLeft || { top: 0, left: 0 };
            if (ele && HtmlTag.GetStyleValue(ele, "position") === "absolute") {
                topLeft = {
                    top: topLeft.top + parseFloat(ele.style.top),
                    left: topLeft.left + parseFloat(ele.style.left)
                }
                return topLeft;
            }
            else if (ele && ele !== document.body) {
                return HtmlTag.GetTopLeft(ele.parentNode, topLeft);
            }

            return topLeft;
        }

        static GetStyleValue(ele, name) {
            if (!ele) return "";
            if (ele.style && ele.style[name]) return ele.style[name];
            let styles = HtmlTag.GetStyles(ele);
            if (styles && styles[name]) return styles[name];
            return "";
        }

        static ComputeStringWidth(str) {
            if (Common.IsNullOrEmpty(str)) return 0;

            HtmlTag.SpanId = HtmlTag.SpanId || Common.CreateGuid();
            let span = HtmlTag.GetById(HtmlTag.SpanId);
            if (span === null) {
                span = document.createElement("span");
                span.id = HtmlTag.SpanId;
                span.style.visibility = "hidden";
                document.body.appendChild(span)
            }
            span.innerHTML = "";
            let width = span.offsetWidth;
            span.innerHTML = str;
            width = span.offsetWidth - width;
            span.innerHTML = "";
            return width;
        }

        static GetStyles(ele) {
            if (!ele) return null;
            if (ele.ownerDocument) return ele.ownerDocument.defaultView.getComputedStyle(ele);
            else if (ele.currentStyle) return ele.currentStyle;
            return null;
        }

    }

})($ns);