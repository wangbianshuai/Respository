((ns) => {
    const { Index } = ns.components
    const { Connect } = ns.data.Index
    const { Button, SpanLabel, TextBox } = ns.controls
    const { PagingIndexQueryAction } = ns.actions
    const { Common, HtmlTag } = ns.utils

    ns.components.DataPaging = class DataPaging extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivPage: "DivPage" }
        }

        InitControls() {
            let entityButton = new Button({ Action: new PagingIndexQueryAction(this), Width: 50 })

            this.ControlList = []
            this.ControlList.push(this.GetPagingButton("PagingFirstAction"))//0
            this.ControlList.push(this.GetPagingButton("PagingPreAction"))//1
            this.ControlList.push(new SpanLabel({ Label: 1, IsColon: false, IsWidth: false, ClassName: "SpanIndex" }))//2
            this.ControlList.push(this.GetPagingButton("PagingNextAction"))//3
            this.ControlList.push(this.GetPagingButton("PagingLastAction"))//4
            this.ControlList.push(new SpanLabel({ Label: "到", IsColon: false, IsWidth: false }))//5
            this.ControlList.push(new TextBox({ Name: "IndexCount", MaxLength: 10, Width: 50, EnterControl: entityButton }))//6
            this.ControlList.push(new SpanLabel({ Label: "页", IsColon: false, IsWidth: false }))//7
            this.ControlList.push(entityButton)//8

            this._ctls = {
                First: this.ControlList[0],
                Pre: this.ControlList[1],
                Next: this.ControlList[3],
                Last: this.ControlList[4],
                IndexCount: this.ControlList[6],
                IndexQuery: this.ControlList[8]
            }
        }

        GetPagingButton(name) {
            return new Button({ Action: new ns.actions[name](this), ClassName: "Button", Width: 35 })
        }

        GetHtml() {
            this.IsPage && this.InitControls()

            let html = []
            html.push(`<div class="${this.Styles.DivPage}" style="display:none;" id="${this.Id}">`)
            html.push(`<div class=\"DivLeft\"><span class="SpanRecord" id="record_${this.Id}"></span></div>`)

            if (this.IsPage) {
                html.push("<div class=\"DivRight\"><ul>")
                html = html.concat(this.ControlList.map((c) => "<li>" + c.GetHtml() + "</li>"))
                html.push("</ul></div>")
            }
            html.push("</div>")
            return html.join("")
        }

        InitTagObject() {
            this.PageTag = HtmlTag.GetById(this.Id)
            this.SpanRecord = HtmlTag.GetById("record_" + this.Id)
        }

        DataLoad() {
            Connect((state) => {
                this.GetDataValue(state, "QueryResponse").then(res => {
                    res && this.SetQueryResponse()
                })
            })
        }

        SetQueryResponse() {
            let res = this.QueryResponse
            if (res == null) { return }

            if (res.PageRecord >= 0) this.PageRecord = res.PageRecord
            else if (!res.DataList || res.DataList.length === 0) this.PageRecord = 0

            if (this.IsPage) this.BindPage()
            else {
                this.PageRecord = res.DataList.length;
                this.BindRecord();
            }
        }

        BindRecord() {
            if (this.PageRecord == 0) {
                HtmlTag.SetHide(this.PageTag)
                return
            }

            //SpanRecord
            let record = `共 ${this.PageRecord} 条记录`

            HtmlTag.SetHtml(this.SpanRecord, record)
            HtmlTag.SetShow(this.PageTag)
        }

        BindPage() {
            this.PageIndex = this.SearchAction.PageIndex

            if (this.PageRecord == 0) {
                this.PageIndex = 1
                this.PageCount = 0

                HtmlTag.SetHide(this.PageTag)
                return
            }
            if (this.PageRecord % this.PageSize == 0) {
                this.PageCount = parseInt(this.PageRecord / this.PageSize)
            }
            else {
                this.PageCount = parseInt(this.PageRecord / this.PageSize) + 1
            }
            this.PageIndex = this.PageIndex < 1 ? 1 : this.PageIndex
            this.PageIndex = this.PageIndex > this.PageCount ? this.PageCount : this.PageIndex

            //SpanIndex
            this.ControlList[2].SetValue(this.PageIndex)

            //SpanRecord
            let startNum = (this.PageIndex - 1) * this.PageSize + 1
            let endNum = this.PageIndex * this.PageSize
            endNum = endNum > this.PageRecord ? this.PageRecord : endNum

            let record = `${startNum} - ${endNum} 共 ${this.PageCount} 页 ${this.PageRecord} 条记录`
            HtmlTag.SetHtml(this.SpanRecord, record)

            this.SetPageControlDisabled()

            HtmlTag.SetShow(this.PageTag)
        }

        SetPageControlDisabled() {
            let ed = this.JudgePage()

            ed.Enableds.forEach((e) => this._ctls[e].SetDisabled(false))
            ed.Disbleds.forEach((e) => this._ctls[e].SetDisabled(true))
        }

        JudgePage() {
            var ed = {}
            if (this.PageCount <= 1) {
                ed.Enableds = []
                ed.Disbleds = ["First", "Pre", "Next", "Last", "IndexCount", "IndexQuery"]
            }
            else if (this.PageIndex == 1) {
                ed.Enableds = ["Next", "Last", "IndexCount", "IndexQuery"]
                ed.Disbleds = ["First", "Pre"]
            }
            else if (this.PageIndex == this.PageCount) {
                ed.Enableds = ["First", "Pre", "IndexCount", "IndexQuery"]
                ed.Disbleds = ["Next", "Last"]
            }
            else {
                ed.Enableds = ["First", "Pre", "Next", "Last", "IndexCount", "IndexQuery"]
                ed.Disbleds = []
            }
            return ed
        }

        GetInputPageIndex() {
            //IndexCount
            let indexCountHtmlTag = this.ControlList[6]
            let indexCount = parseInt(indexCountHtmlTag.GetValue())
            if (indexCount > 0 && indexCount <= this.PageCount) {
                this.PageIndex = indexCount
            }
            else {
                Common.Alert("对不起，请输入1至" + this.PageCount + "之间的自然数页索引！").then(() => indexCountHtmlTag.Element.focus())
                return false
            }
            indexCountHtmlTag.SetValue("")

            return this.PageIndex
        }
    }

})($ns);