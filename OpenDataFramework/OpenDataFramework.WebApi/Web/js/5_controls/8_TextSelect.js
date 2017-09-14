((ns) => {
    const { TextBox } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.TextSelect = class TextSelect extends TextBox {
        constructor(options) {
            super(options)

            this.DataList = this.DataList || [];
            this.SelectDataList = [];
            this.ValueName = this.ValueName || "Value";
            this.TextName = this.TextName || "Text";
            this.SelectValue = "";
            this.SelectText = "";
            this.MaxItemLength = 100;
        }

        EventLoad3() {
            HtmlTag.BindEvent(this.Element, "click", (e) => { this.LoadSelect(e) });
            HtmlTag.BindEvent(this.Element, "change", (e) => { this.InputChange(e) });
            HtmlTag.BindEvent(this.Element, "keydown", (e) => { this.SearchByKeyword(e) });
            HtmlTag.BindEvent(this.Element, "keypress", (e) => { this.SearchByKeyword(e) });
        }

        SearchByKeyword(e) {
            if (this.TimeoutId) window.clearInterval(this.TimeoutId);
            this.TimeoutId = window.setTimeout(() => this.BandKeywordData(), 150);
        }

        BandKeywordData() {
            if (!this.IsEnable) { this.LoadSelect() }
            if (!this.IsEnable) return;
            this.SelectDataList = this.SearchData();
            this.SetSelectOffSet();
            const { Width, Height } = this.SelectOffSet;

            HtmlTag.SetStyle(this.SelectTag, { width: Width + "px", height: Height + "px" });
            HtmlTag.SetHtml(this.ContentTag, this.GetItemHtml(this.SelectDataList));

            this.BindSelectEvents();
        }

        InputChange(e) {
            var value = Common.Trim(e.target.value);
            if (!Common.IsEquals(value, this.SelectText)) {
                this.SelectValue = "";
                this.SelectText = "";
                e.target.value = "";
            }
        }

        LoadSelect() {
            if (this.DataList.length == 0 || this.IsEnable) {
                return;
            }

            let offSet = HtmlTag.GetOffSet(this.Element);
            this.SelectOffSet = {
                Top: offSet.top + offSet.height + 1,
                Left: offSet.left + 1
            }

            HtmlTag.AppendHtml(document.body, this.GetSelectHtml());
            this.IsEnable = true;

            this.SelectEventLoad();
        }

        SetSelectOffSet() {
            var width = this.GetDataMaxWidth(this.SelectDataList) + 20;
            width = width > this.Width + 2 ? width : this.Width + 2;

            let height = this.SelectDataList.length * 30;
            height = height > 300 ? 300 : height;

            this.SelectOffSet.Width = width;
            this.SelectOffSet.Height = height;
        }

        GetSelectHtml() {
            this.SelectDataList = this.SearchData();
            this.SetSelectOffSet();

            const { Top, Left, Width, Height } = this.SelectOffSet;
            let zIndex = Common.GetZIndex();

            var html = [];

            html.push(`<div class="TextSelect" style="z-index:${zIndex};top:${Top}px;left:${Left}px;width:${Width}px;height:${Height}px;" id="divSelect_${this.Id}">`);
            html.push(`<div class="SelectArea" id="divContent_${this.Id}">`);
            html.push(this.GetItemHtml(this.SelectDataList));
            html.push("</div></div>");

            return html.join("");
        }

        GetItemHtml(dataList) {
            var html = [], value = "", text = "";;

            html.push("<ul>");
            dataList.forEach(item => {
                item.Id = Common.CreateGuid();
                value = item[this.ValueName];
                text = item[this.TextName];
                if (!Common.IsNullOrEmpty(value) && !Common.IsNullOrEmpty(text)) {
                    html.push(`<li><a class="DivRadiusBorder" id=${item.Id} href="javascript:void(0);">${text}</a></li>`);
                }
            });
            html.push("</ul>");

            return html.join("");
        }

        GetDataMaxWidth(dataList) {
            var width = 0, w = 0, t = null;
            dataList.forEach(d => {
                t = d[this.TextName]
                if (t) {
                    w = Common.ComputeStringWidth(t)
                    width = w > width ? w : width;
                }
            });
            return width;
        }

        SearchData() {
            let term = HtmlTag.GetValue(this.Element);

            let dataList = [], iCount = 0;
            if (!term) {
                iCount = this.DataList.length > this.MaxItemLength ? this.MaxItemLength : this.DataList.length;
                for (let i = 0; i < iCount; i++) {
                    dataList.push(this.DataList[i]);
                }
            }
            else {
                let value = "", text = "";
                this.DataList.forEach(d => {
                    value = d[this.ValueName]; text = d[this.TextName];
                    if (value && text && text.indexOf(term) >= 0) dataList.push(d);
                });
            }

            return dataList;
        }

        SelectEventLoad() {
            this.SelectTag = HtmlTag.GetById("divSelect_" + this.Id);
            this.ContentTag = HtmlTag.GetById("divContent_" + this.Id);

            HtmlTag.OffBindEvent(document.body, "click.TextSelect");
            HtmlTag.BindEvent(document.body, "click.TextSelect", (e) => {
                const { Top, Left, Width, Height } = this.SelectOffSet;
                var x = e.pageX, y = e.pageY;
                var blExists = true;
                if (x < Left || x > Left + Width) {
                    blExists = false;
                }
                else if (y < Top - 35 || y > Top + Height) {
                    blExists = false;
                }
                if (!blExists) {
                    this.Destory();
                }
            });

            this.BindSelectEvents();
        }

        BindSelectEvents() {
            this.SelectDataList.forEach(d => {
                HtmlTag.BindEvent(HtmlTag.GetById(d.Id), "click", (e) => {
                    this.SetSelectItem(e.target.id);
                });
            })
        }

        SetSelectItem(id) {
            let list = this.SelectDataList.filter(f => f.Id === id)
            if (list.length === 1) {
                this.SelectText = list[0][this.TextName];
                this.SelectValue = list[0][this.ValueName];
                HtmlTag.SetValue(this.Element, this.SelectText);
                this.Destory();
            }
        }

        GetValue() {
            return this.SelectValue || "";
        }

        SetValue(value) {
            this.SelectValue = value;
            let list = this.DataList.filter(f => Common.IsEquals(f[this.ValueName], value))
            if (list.length === 1) {
                this.SelectText = list[0][this.TextName];
                HtmlTag.SetValue(this.Element, this.SelectText);
            }
        }

        DataLoad3() {
            if (this.DataSource) {
                this.Element.placeholder = "数据源加载中……"
                this.GetDataList().then(() => {
                    this.Element.placeholder = "";
                    if (!this.SelectText && this.SelectValue) this.SetValue(this.SelectValue);
                })
            }
        }

        Destory() {
            this.IsEnable = false;
            HtmlTag.RemoveElement(document.body, this.SelectTag);
            HtmlTag.OffBindEvent(document.body, "click.TextSelect");
        }
    }

})($ns);