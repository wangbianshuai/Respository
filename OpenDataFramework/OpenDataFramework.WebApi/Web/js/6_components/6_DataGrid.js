((ns) => {
    const { Index, GridHeader, DataItem } = ns.components
    const { Connect } = ns.data.Index
    const { Common, HtmlTag } = ns.utils
    const { EditAction, DeleteAction, UpdateStatusAction, LookRejectRecordAction, LookOperationLogAction } = ns.actions


    ns.components.DataGrid = class DataGrid extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivGrid: "DivGrid", DivGridContent: "DivGridContent" }
        }

        InitControls() {
            this.DataList = []
            this.GetDataActions()

            this.Properties.forEach(p => {
                if (!p.Action && p.ActionInvoke) { p.Action = new ns.actions.Index(this); p.Action.Invoke = p.ActionInvoke }
            })
            this.Properties = this.Properties.sort((a, b) => a.X > b.X ? 1 : -1);
            this.IsDataStatus && this.Properties.push({ Name: "DataStatusName", Label: "状态", ColumnWidth: 70, TextAlign: "center" })
            this.DataActions.length > 0 && this.Properties.push({ Name: "Operation", Label: "操作", Actions: this.DataActions, ColumnWidth: this.DataActions.length * 40, ControlType: "LinkButtonList", TextAlign: "center" });

            this.ComputeWidth()

            this.GridHeaderComponent = new GridHeader({ Properties: this.Properties, DataGrid: this, IsCheckBox: this.IsCheckBox, Width: this.Width, IsFixedWidth: this.IsFixedWidth })
            this.ComponentList = [this.GridHeaderComponent]
        }

        ComputeWidth() {
            let width = 0;
            let iCount = 0
            this.Properties.forEach((p) => {
                width += p.ColumnWidth > 0 ? p.ColumnWidth : 0
                iCount += p.ColumnWidth > 0 ? 0 : 1
            })

            let gridWidth = 800

            if (iCount > 0 && gridWidth > width) {
                let columnWidth = Math.floor((gridWidth - width - 10) / iCount)

                this.Properties.forEach((p) => {
                    p.ColumnWidth = p.ColumnWidth > 0 ? p.ColumnWidth : columnWidth
                })
            }

            this.Width = this.Width || width;
        }

        GetDataActions() {
            this.DataActions = []

            this.IsDataStatus && this.DataActions.push(new UpdateStatusAction(this));
            this.IsDataStatus && this.DataActions.push(new LookRejectRecordAction(this));
            this.IsLookLog && this.DataActions.push(new LookOperationLogAction(this));
            this.IsEdit && this.DataActions.push(new EditAction(this))
            this.IsDelete && this.DataActions.push(new DeleteAction(this))

            return this.DataActions
        }

        GetGridWidth() {
            return HtmlTag.GetWindowWidth() - 40
        }

        GetHtml() {
            this.InitControls()

            let html = []

            let width = this.IsFixedWidth ? this.Width : this.GetGridWidth();
            width = width > this.Width ? width : this.Width;

            html.push(`<div class="${this.Styles.DivGrid}">`)

            html.push(this.ComponentList[0].GetHtml())

            let style = ""
            let styleList = []
            this.Height > 0 && styleList.push(`height:${this.Height - 60}px;`)
            if (styleList.length > 0) style = " style=\"" + styleList.join("") + "\""

            html.push(`<div class="${this.Styles.DivGridContent}"${style}>`)
            html.push(`<table cellpadding="0" cellspacing="0" border="0" style="width:${width}px;" id="${this.Id}">`)
            html.push("<tbody></tbody></table></div></div>")

            return html.join("")
        }

        InitTagObject() {
            this.TableTag = HtmlTag.GetById(this.Id)
            this.TableTbodyTag = Common.ArrayFirst(HtmlTag.Find(this.TableTag, "tbody"))
        }

        EventLoad2() {
            var divContent = this.TableTag.parentNode
            var tableHeader = this.GridHeaderComponent.TableTag

            HtmlTag.BindEvent(divContent, "scroll", (e) => {
                if (tableHeader.CurrentLeft !== e.target.scrollLeft) {
                    tableHeader.CurrentLeft = e.target.scrollLeft
                    tableHeader.style.left = -e.target.scrollLeft + "px"
                }
            })

            if (!this.IsLocalData && !this.Height) {
                this.SetReSize();
                HtmlTag.BindEvent(window, "resize." + this.Id, (e) => window.setTimeout(() => this.SetReSize(e), 10));
            }

            this.ChangeTdWidth();
        }

        DataLoad() {
            this.Properties.forEach((p) => {
                ns.data.Cache.GetPropertyDataList(p)
            })

            Connect((state) => {
                this.GetDataValue(state, "QueryResponse").then(res => {
                    res && this.SetQueryResponse()
                })
            })
        }

        ChangeTdWidth() {
            let key = "";
            let hthList = HtmlTag.Find(this.GridHeaderComponent.TableTag, "thead>tr>th");
            hthList.forEach(th => {
                HtmlTag.BindEvent(th, "mousedown", (e) => this.ThMouseDown(e));
                HtmlTag.BindEvent(th, "mousemove", (e) => this.ThMouseMove(e));
            })

            HtmlTag.BindEvent(window, "mousemove." + this.Id, (e) => this.WindowMouseMove(e));
            HtmlTag.BindEvent(window, "mouseup." + this.Id, (e) => this.WindowMouseUp(e));
        }

        ThMouseDown(e) {
            if (e.target.type === "checkbox") return;
            if (e.target.childNodes && e.target.childNodes[0].type === "checkbox") return;
            
            if (e.target.tagName.toLowerCase() === "select") return;

            if (this.IsCanMove) {
                this.IsThMouseDown = true;
                this.SelectTh = e.target.tagName === "span" ? e.target.parentNode : e.target;
                this.MoveLineId = this.MoveLineId || Common.CreateGuid();
                this.StartX = e.pageX;

                var offset = HtmlTag.GetOffSet(this.TableTag.parentNode)
                var top = offset.top - 32;
                var height = offset.height + 32;
                offset = HtmlTag.GetOffSet(this.SelectTh)
                var left = offset.left + offset.width;
                left = left < this.StartX ? this.StartX : left;
                let zIndex = Common.GetZIndex();
                var html = `<div class="DivMoveLine" id="${this.MoveLineId}" style="height:${height}px;top:${top}px;left:${left}px;z-index:${zIndex}"></div>`;
                HtmlTag.AppendHtml(document.body, html);
            }
            return false;
        }

        ThMouseMove(e) {
            if (e.target.type === "checkbox") return;
            if (e.target.childNodes && e.target.childNodes[0].type === "checkbox") return;

            if (e.target.tagName.toLowerCase() === "select") return;

            let th = e.target.tagName === "span" ? e.target.parentNode : e.target;

            var offset = HtmlTag.GetOffSet(th);
            var width = offset.width;

            if (this.IsThMouseDown) {
                HtmlTag.SetStyleValue(th, "cursor", "e-resize");
                this.IsMoveTh = true;
                var line = HtmlTag.GetById(this.MoveLineId);
                HtmlTag.SetStyleValue(line, "left", e.pageX + "px");
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                return false;
            }
            else if (e.pageX + 10 > offset.left + width - this.TableTag.parentNode.scrollLeft) {
                HtmlTag.SetStyleValue(th, "cursor", "e-resize");
                this.IsCanMove = true;
            }
            else {
                HtmlTag.SetStyleValue(th, "cursor", "default");
            }
        }

        WindowMouseMove(e) {
            if (this.IsThMouseDown) {
                document.unselectable = "on";
                document.onselectstart = function () {
                    return false;
                };
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                return;
            }
        }

        WindowMouseUp(e) {
            if (this.IsThMouseDown && this.IsMoveTh && this.SelectTh) {
                var x = e.pageX - this.StartX;
                var th = this.SelectTh;
                var offset = HtmlTag.GetOffSet(th);
                let w1 = offset.width;

                var width = w1 + x;
                width = width < 30 ? 30 : width;
                x = width - w1;

                this.SetThTdWidth(th, width);

                HtmlTag.SetStyleValue(th, "cursor", "default");

                offset = HtmlTag.GetOffSet(this.TableTag);
                width = offset.width + x;

                HtmlTag.SetWidth(this.TableTag, width);
                HtmlTag.SetWidth(this.GridHeaderComponent.TableTag, width);
            }

            HtmlTag.RemoveElement(document.body, HtmlTag.GetById(this.MoveLineId));
            this.IsThMouseDown = false;
            this.IsMoveTh = false;
            this.SelectTh = null;
            this.IsCanMove = false;
            document.unselectable = "off";
            document.onselectstart = null;
        }

        SetThTdWidth(selectth, width) {
            let index = -1, offSet = null;
            let hthList = HtmlTag.Find(this.GridHeaderComponent.TableTag, "thead>tr>th");
            let widthList = []
            hthList.forEach((th, i) => {
                if (th === selectth) index = i;
                offSet = HtmlTag.GetOffSet(th);
                widthList.push(offSet.width);
                HtmlTag.SetWidth(th, offSet.width);
            });
            HtmlTag.SetWidth(selectth, width);

            let rowList = HtmlTag.Find(this.TableTag, "tbody>tr");
            let td = null;
            let selectTdList = [];
            rowList.forEach(row => {
                for (let i = 0; i < row.childNodes.length; i++) {
                    td = row.childNodes[i];
                    if (i === index) selectTdList.push(td);
                    HtmlTag.SetWidth(td, widthList[i]);
                }
            });

            selectTdList.forEach(td => {
                HtmlTag.SetWidth(td, width);
            })
        }

        SetReSize(e) {
            let divGridView = this.TableTag.parentNode.parentNode.parentNode;
            let offSet = HtmlTag.GetOffSet(divGridView);
            let height = HtmlTag.GetWindowHeight()
            height = height - offSet.top - 90;
            height = height < 250 ? 250 : height;
            HtmlTag.SetHeight(this.TableTag.parentNode, height);
            if (!this.IsFixedWidth) {
                let width = this.GetGridWidth()
                if (width > this.Width) {
                    HtmlTag.SetWidth(this.TableTag, width);
                    HtmlTag.SetWidth(this.GridHeaderComponent.TableTag, width);
                }
            }
        }

        SaveData(d) {
            let key = this.Entity.PrimaryKey
            let list = this.DataList.filter(f => f[key] === d[key])
            if (list && list.length === 1) {
                list[0] = Object.assign(list[0], d)
            }
            else {
                this.DataList.push(d)
            }
            this.BindData([d[key]])
        }

        DeleteData(id) {
            let index = -1
            let key = this.Entity.PrimaryKey
            for (let i = 0; i < this.DataList.length; i++) {
                if (this.DataList[i][key] === id) {
                    index = i
                    break
                }
            }
            if (index >= 0) {
                this.DataList.splice(index, 1)
                this.BindData([])
            }
        }

        GetValue() { return this.DataList }

        SetValue(value) {
            if (value && value.length > 0) this.DataList = value.map(m => Object.assign({}, m))
            this.BindData([])
        }

        BindData(idList) {
            this.RowCount = this.DataList.length
            this.DataItemComponentList = this.DataList.map((d, i) => new DataItem({
                RowIndex: i,
                Properties: this.Properties,
                Data: d,
                IsCheckBox: this.IsCheckBox,
                IsFixedWidth: this.IsFixedWidth,
                PrimaryKey: this.Entity.PrimaryKey,
                DataGrid: this,
                SelectIdList: idList
            }))

            let html = this.DataItemComponentList.map((c, i) => c.GetHtml())
            HtmlTag.SetHtml(this.TableTbodyTag, html.join(""))

            this.DataItemComponentList.forEach((c) => {
                c.EventLoad()
                c.DataLoad()
            })

            if (this.IsLocalData && this.SpanRecord) {
                let record = `共 ${this.RowCount} 条记录`
                HtmlTag.SetHtml(this.SpanRecord, record)
            }

            this.IsCheckBox && this.GridHeaderComponent.CheckBoxControl.SetChecked(false)
        }

        SetQueryResponse() {
            let res = this.QueryResponse
            if (res == null) { return }

            if (this.IsFailMessage(res)) { return }

            if (res.DataList != null) {
                let idList = res.Ids ? res.Ids.split(",") : []
                this.DataList = res.DataList
                this.BindData(idList)
            }
        }

        GetCheckBoxControlList() {
            return this.DataItemComponentList.map(m => m.CheckBoxControl)
        }

        GetCheckedValue() {
            let dataList = [];
            this.DataItemComponentList.forEach(c => {
                if (c.CheckBoxControl.GetChecked()) dataList.push(c.Data)
            })
            return dataList;
        }
    }

})($ns);