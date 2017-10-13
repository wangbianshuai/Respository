((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.components.ExcelImport = class ExcelImport {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)
        }

        Import() {
            if (window.FileReader) {
                this.ExcelImportForFileReader()
            }
            else {
                Common.Alert("对不起，浏览器不支持Excel导入方式，请使用Chrome或Chrome内核浏览器！")
            }
        }

        ExcelImportForFileReader() {
            this.ExcelImportDialog = new ns.components.Dialog({
                Width: 600,
                Height: 100,
                Html: this.GetHtml(),
                Title: "Excel导入",
                OkLabel: "导入",
                OkAction: {
                    Invoke: (e, c) => { this.ExecExcelImport(c) }
                }
            })

            this.ExcelImportDialog.Show()
        }

        ExecExcelImport(c) {
            let fileInput = HtmlTag.GetById("file_" + this.Id)

            var files = fileInput.files
            if (files.length == 0) {
                Common.Alert("对不起，请选择Excel导入文件！")
                return
            }
            var file = files[0]
            var ft = ""

            if (file.type == "application/vnd.ms-excel") {
                ft = ".xls"
            }
            else if (file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                ft = ".xlsx"
            }
            if (ft == "") {
                Common.Alert("对不起，只能导入Excel文件！")
                return
            }
            if (file.size > 1024 * 1024) {
                Common.Alert("对不起，Excel文件大小不能大于1M")
                return
            }

            c.SetDisabled(true)
            this.SendFileRequest(file, ft, c)
        }

        GetHtml() {
            var html = [];
            html.push("<div class=\"DivText\" style=\"height:30px;\"><dl><dt><span>Excel文件：</span></dt>")
            html.push("<dd><input type=\"file\" id=\"file_" + this.Id + "\"")
            html.push(" accept=\"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\" style=\"width:500px;\" class=\"TextBox\"></dd>")
            html.push("</dl></div>");
            html.push("<div class=\"DivText\" style=\"height:30px;line-height:30px;\"><dl><dt><span>数据状态：</span></dt>")
            html.push("<dd><label style=\"cursor:pointer;\"><input type=\"checkbox\" id=\"ckb_" + this.Id + "\" checked=\"checked\" style=\"margin-right:3px;\"/>已提交</label></dd>")
            html.push("</dl></div>")
            return html.join("")
        }

        SendFileRequest(file, ft, c) {
            var url = "ExcelImportHandler.ashx?EntityName=" + this.Entity.Name + "&ft=" + ft

            let userId = Common.GetStorage("LoginUserId");
            if (!userId) Common.ToLogin();
            url = Common.AddURLParameter(url, "LoginUserId", userId);
            
            let checkbox = HtmlTag.GetById("ckb_" + this.Id)
            let dataStatus = checkbox && checkbox.checked ? 1 : 0
            url = Common.AddURLParameter(url, "DataStatus", dataStatus);

            var fr = new FileReader()

            fr.onloadend = () => {
                this.Api.PostStreamFetch(url, fr.result).then(res => {
                    c.SetDisabled(false)

                    if (res.MessageList && res.MessageList.length > 0) {
                        this.ShowMessageList(res)
                        if (res.Message && res.Message.indexOf("操作成功") === 0) {
                            this.SearchAction.ExcelRefresh()
                            this.ExcelImportDialog.Close()
                        }
                    }
                    else if (res.Message) {
                        Common.Alert(unescape(res.Message)).then(() => {
                            if (res.Message.indexOf("操作成功") === 0) {
                                this.SearchAction.ExcelRefresh()
                                this.ExcelImportDialog.Close()
                            }
                        })
                    }

                }, res => {
                    c.SetDisabled(false)
                    const msg = res && res.message ? res.message : res
                    Common.Alert(msg)
                })
            }

            fr.readAsArrayBuffer(file)
        }

        ShowMessageList(data) {
            var html = []
            var colName = "错误提示"
            html.push("<div class=\"DivList\">")
            if (!Common.IsNullOrEmpty(data.Message)) {
                html.push(`<div class="DivText"><span>${data.Message}</span></div>`)
                if (data.Message.indexOf("操作成功") == 0) {
                    colName = "信息"
                }
            }
            html.push("<div class=\"DivData\"><div class=\"DivGridView\">")
            html.push("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">")
            html.push(`<thead><tr><td width=\"40\">行号</td><td width=\"800\">${colName}</td></tr></thead>`)
            html.push("<tbody>")
            data.MessageList.forEach(item => {
                html.push("<tr>")
                html.push(`<td>${item.RowNum}</td>`)
                html.push(`<td>${item.Message}</td>`)
                html.push("</tr>")
            })
            html.push("</tbody></table></div></div></div>")

            this.ExcelMessageDialog = new ns.components.Dialog({
                Width: 850,
                Height: 500,
                Html: html.join(""),
                Title: "Excel导入提示信息",
                IsOkButton: false
            })

            this.ExcelMessageDialog.Show()
        }
    }

})($ns);
