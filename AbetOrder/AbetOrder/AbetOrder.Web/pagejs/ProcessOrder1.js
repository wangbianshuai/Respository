(function () {
    function Order() {
        this.Load = function () {
            this.QueryString = Common.GetPageQueryString();

            this.Id = Common.GetObjValue(this.QueryString, "Id");
            this.LoginUserId = Common.GetObjValue(this.QueryString, "LoginUserId");
            this.Token = Common.GetObjValue(this.QueryString, "Token");

            Common.SetStorage("LoginUserId", this.LoginUserId);
            Common.SetStorage("Token", this.Token);

            LoadOrder.call(this);

            $("#btnExportPdf").click(function () {
                Cnvert2Canvas();
            });
        };

        function LoadOrder() {
            var url = "ViewOrder/GetOrder2(" + this.Id + ")";

            var $this = this;
            DataAccess.GetRequest(url, function (data) {
                LoadHtml.call($this, data.ViewOrder);
            });
        }

        function LoadHtml(data) {
            var contentList = $("#contentList");

            var html = [];

            //第一页
            html.push("<div class=\"DivContent2\"><div class=\"DivContent\" id=\"content1\"><div id=\"divContent1\">");

            html.push(GetHeaderHtml());

            html.push("<div class=\"DivName\"><span style=\"color:#666;\">订购门板花式：</span><span>" + data.OrderName + "</span></div>");

            html.push("<div id=\"divDetailList1\"></div>");

            html.push("</div></div></div>");

            contentList.html(html.join(""));

            Order.CurrentPage = 1;

            GetOrderDetailsHtml(data);

            if (data.Remarks) GetRemarkHtml(data);
        }

        function AddContentPage(pageCount) {
            var contentList = $("#contentList");

            var html = [];

            //第一页
            html.push("<div class=\"DivContent2\"><div class=\"DivContent\" id=\"content" + pageCount + "\"><div id=\"divContent" + pageCount + "\">");
            html.push("<div id=\"divDetailList" + pageCount + "\"></div>");
            html.push("</div></div></div>");

            contentList.append(html.join(""));
        }

        function GetOrderDetailsHtml(data) {
            data.Details = data.Details.sort(function (a, b) {
                return a.DisplayIndex > b.DisplayIndex ? 1 : -1;
            });

            for (var i = 0; i < data.Details.length; i++) {
                GetDetailRow(data.Details[i], i === data.Details.length - 1);
            }


            var html = [];
            var id = Guid.NewGuid();

            html.push("<table cellpadding=\"0\" id=\"" + id + "\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"DivDetail\">");
            html.push("<tr class=\"TdRemarkSplit\"><td></td><td></td></tr>")
            html.push("</table>");

            AppendDetailRow(html.join(""), id);
        }

        function GetRemarkHtml(data) {
            data.Remarks = data.Remarks.sort(function (a, b) {
                return a.DisplayIndex > b.DisplayIndex ? 1 : -1;
            });

            for (var i = 0; i < data.Remarks.length; i++) {
                GetRemarkRow(data.Remarks[i], i === 0);
            }
        }

        function GetRemarkRow(data, blFirst) {
            var html = [];

            var id = Guid.NewGuid();

            html.push("<table cellpadding=\"0\"  id=\"" + id + "\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"DivDetail\">");

            html.push("<tr>")
            html.push("<td style=\"width:90px;\"><span style=\"color:#666;\">" + (blFirst ? "备注：" : "") + "</span></td>");
            html.push("<td><span style=\"" + GetRemarkStyle(data) + "\">" + data.DisplayIndex + "." + (data.Remark || "") + "</span></td>");

            html.push("</tr>");

            html.push("</table>");

            AppendDetailRow(html.join(""), id);
        }

        function GetAmountTotalRow(data, id) {
            var html = [];

            html.push("<table cellpadding=\"0\" id=\"" + id + "\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"DivDetail\">");

            html.push("<tr><td class=\"TdAmountTotal\" colspan=\"2\"><div>");
            html.push("<span style=\"color:#666;\">金额合计：（小写）</span>");
            html.push("<span style=\"margin-left:20px;\">" + data.ActualAmount + "</span>");
            html.push("<span style=\"color:#666;margin-left:20px;\">元</span>");
            html.push("<span style=\"color:#666;margin-left:80px;\">（大写）</span>");
            html.push("<span style=\"text-decoration:underline\">" + data.AmountUpper + "</span>");
            html.push("</div></td></tr>");

            html.push("</table>");

            return html.join("");
        }

        function GetTotalRow(data, id) {
            var html = [];

            html.push("<table cellpadding=\"0\" id=\"" + id + "\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"DivDetail\">");

            html.push("<tr><td class=\"TdTotal\" colspan=\"2\"><div>");
            html.push("<span style=\"color:#666;\">合计，面积(㎡)：</span>");
            html.push("<span>" + data.TotalArea + "</span>");
            html.push("<span style=\"color:#666;margin-left:20px;\">金额(RMB)：</span>");
            html.push("<span>" + data.ActualAmount + "</span>");
            html.push("<span style=\"color:#666;margin-left:20px;\">数量(件)：</span>");
            html.push("<span>" + data.TotalNumber + "</span>");
            html.push("</div></td></tr>");

            html.push("</table>");

            return html.join("");
        }

        function GetDetailRow(detail, blLast) {
            var html = [];

            var id = Guid.NewGuid();

            html.push("<table cellpadding=\"0\" id=\"" + id + "\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"DivDetail\">");

            html.push("<tr>")
            html.push("<td class=\"Td60\">" + GetLabelValue("序号", detail.DisplayIndex) + "</td>");
            html.push("<td class=\"Td40\"></td>");
            html.push("</tr>");
            if (detail.DetailType === 1) {
                html.push("<tr>")
                html.push("<td class=\"Td60\">" + GetLabelValue("面积(㎡)", detail.Height + "<span style=\"color:#666;\">(mm)×</span>" + detail.Width + "<span style=\"color:#666;\">(mm)×</span>" + detail.Number + "<span style=\"color:#666;\">=</span>" + detail.Area.toFixed(4)) + "</td>");
                html.push("<td class=\"Td40\"></td>");
                html.push("</tr>");
            }

            if (blLast) html.push("<tr><td colspan=\"2\"><div>");
            else html.push("<tr><td class=\"TdRemark\" colspan=\"2\"><div>");

            html.push("<span style=\"color:#666;\">备注：</span>");
            html.push("<span style=\"" + GetRemarkStyle(detail) + "\">" + (detail.Remark || "") + "</span>");
            html.push("</div></td></tr>");

            html.push("</table>");

            AppendDetailRow(html.join(""), id);
        }

        function AppendDetailRow(html, id) {
            var divDetailList = $("#divDetailList" + Order.CurrentPage);

            var height = $("#divContent" + Order.CurrentPage).height();

            if (height < 1684 - 50) {
                divDetailList.append(html);
            }
            else {
                Order.CurrentPage += 1;
                AddContentPage(Order.CurrentPage);

                divDetailList = $("#divDetailList" + Order.CurrentPage);
                divDetailList.append(html);
            }

            height = $("#divContent" + Order.CurrentPage).height();

            if (height > 1684) {
                $("#" + id).remove();

                Order.CurrentPage += 1;
                AddContentPage(Order.CurrentPage);

                divDetailList = $("#divDetailList" + Order.CurrentPage);
                divDetailList.append(html);
            }
        }

        function GetLabelValue(label, value) {
            return "<span style=\"color:#666;\">" + label + "：</span><span>" + value + "</span>";
        }

        function GetCreateUserHtml(data) {
            var html = [];

            var id = Guid.NewGuid();

            html.push("<table cellpadding=\"0\" cellspacing=\"0\" id=\"" + id + "\" border=\"0\" width=\"100%\" class=\"DivInfo\">");

            var list = [];
            AddInfoItem(list, "营业代表：", data.User ? data.User.UserName + (data.User.Phone || "") + "<span style=\"color:#666;margin-left:20px;\">核准：</span>_____________" : "");
            AddInfoItem(list, "付款方式：", "银行汇款");
            html.push(GetInfoRow2(list));

            list = [];
            AddInfoItem(list, "制单：", data.User ? data.User.UserName : "");
            AddInfoItem(list, "已交订金：", data.PaidDepositName);
            html.push(GetInfoRow2(list));

            list = [];
            AddInfoItem(list, "*以上订单已核对无误。 客户确认签字：", "_____________");
            AddInfoItem(list, "应付余款：", data.ShouldPayBalanceName);
            html.push(GetInfoRow2(list));

            html.push("</table>");

            AppendDetailRow(html.join(""), id);
        }

        function GetCustomerUserHtml(data) {
            var html = [];

            html.push("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"DivInfo\">");

            var list = [];
            AddInfoItem(list, "订货日期：", data.OrderDate ? data.OrderDate.substr(0, 10) : "");
            AddInfoItem(list, "账户名：", data.User ? data.User.UserName : "");
            html.push(GetInfoRow(list));

            list = [];
            AddInfoItem(list, "交期：", data.Days);
            AddInfoItem(list, "汇款账号：", data.User ? data.User.BankCardNo : "");
            html.push(GetInfoRow(list));

            list = [];
            AddInfoItem(list, "单号：", data.OrderCode);
            AddInfoItem(list, "开 户 行：", data.User ? data.User.OpenBank : "");
            html.push(GetInfoRow(list));

            html.push("<tr class=\"DivSplit\"><td><td></tr>");

            list = [];
            var value = "";
            if (data.Customer) {
                value = data.Customer.Name;
                if (!String.IsNullOrEmpty(data.Customer.Address)) value += "（" + data.Customer.Address + "）";
            }

            AddInfoItem(list, "定货公司：", value);
            AddInfoItem(list, "送货地址：", data.Customer ? data.Customer.DepotAddress : "");
            html.push(GetInfoRow(list));

            list = [];
            AddInfoItem(list, "联 络 人：", data.Customer ? data.Customer.Consignee : "");
            list.push({ Childrens: GetChildrensInfo(data) });
            html.push(GetInfoRow(list));

            html.push("</table>");

            return html.join("");
        }

        function GetChildrensInfo(data) {
            var list = [];
            AddInfoItem(list, "电话：", data.Customer ? data.Customer.ConsigneePhone : "", "div");
            AddInfoItem(list, "传真：", data.Customer ? data.Customer.Fax : "", "div");

            return list
        }

        function AddInfoItem(list, label, value, tagName) {
            list.push({ Label: label, Value: value || "", TagName: tagName || "td" });
        }

        function GetRemarkStyle(data) {
            var style = [];

            if (!String.IsNullOrEmpty(data.FontColor)) style.push("color:" + data.FontColor);

            if (!String.IsNullOrEmpty(data.FontSize)) {
                var size = parseFloat(data.FontSize.replace("px", "")) * 2;
                if (size > 28) {
                    style.push("line-height:" + (size + 20) + "px");
                }
                style.push("font-size:" + size + "px");
            }

            if (!String.IsNullOrEmpty(data.FontFamily)) style.push("font-family:" + data.FontFamily);

            if (data.IsBold) style.push("font-weight:700");

            if (data.IsUnderline) style.push("text-decoration:underline");

            return style.join(";");
        }

        function GetInfoRow(list, tagName) {
            var html = [];
            tagName = tagName || "tr";

            html.push("<" + tagName + " class=\"DivText\">");

            for (var i = 0; i < list.length; i++) {
                if (list[i].Childrens) {
                    html.push("<td class=\"Div50\">");
                    html.push(GetInfoRow(list[i].Childrens, "div"));
                    html.push("</td>");
                }
                else html.push(GetInfoItem(list[i].Label, list[i].Value, list[i].TagName));
            }

            html.push("</" + tagName + ">");


            return html.join("");
        }

        function GetInfoRow2(list) {
            var html = [];

            html.push("<tr class=\"DivText\">");

            for (var i = 0; i < list.length; i++) {
                html.push(GetInfoItem2(list[i].Label, list[i].Value, i === 0 ? "Td60" : "Td40"));
            }

            html.push("</tr>");

            return html.join("");
        }

        function GetInfoItem2(label, value, tdClass) {
            var html = [];

            html.push("<td class=\"" + tdClass + "\">");
            html.push("<span style=\"color:#666;\">" + label + "</span>");
            html.push("<span>" + value + "</span>");
            html.push("</td>");

            return html.join("");
        }

        function GetInfoItem(label, value, tagName) {
            var html = [];

            html.push("<" + tagName + " class=\"Div50\">");
            html.push("<span style=\"color:#666;\">" + label + "</span>");
            html.push("<span>" + value + "</span>");
            html.push("</" + tagName + ">");

            return html.join("");
        }

        function GetHeaderHtml() {
            var html = [];

            html.push("<div class=\"DivHeader\">");
            html.push("<div class=\"DivLogo\"><img alt=\"\" border=\"0\" src=\"images/logo.png\" width=\"328\" height=\"130\" /></div>");
            html.push("<div class=\"DivTitle\"><span>加工单</span></div>");
            html.push("<div class=\"DivLogo\"></div>");
            html.push("</div>");
            return html.join("");
        }

        function ExportToPdf(img) {
            var data = [], img = null;

            for (var i = 0; i < Order.ImageList.length; i++) {
                img = Order.ImageList[i];
                data.push(img.replace("data:image/png;base64,", ""));
            }

            $.ajax({
                url: "ImageToPdfHandler.ashx",
                type: "POST",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                data: JSON.stringify(data),
                success: function (a, b, c) {
                    if (a.IsSuccess) window.open(a.FileName, "_blank");
                    else if (a.Message) alert(a.Message);
                },
                error: function (a, b, c) {
                }
            });
        }

        function Cnvert2Canvas() {
            Order.ImageList = [];
            Cnvert2CanvasItem("#content1", 1);
        }

        function Cnvert2CanvasItem(id, pageCount) {
            var shareContent = document.querySelector(id);
            var width = shareContent.offsetWidth;
            var height = shareContent.offsetHeight;
            var canvas = document.createElement("canvas");
            var scale = 2;

            canvas.width = width * scale;
            canvas.height = height * scale;
            canvas.getContext("2d").scale(scale, scale);

            var opts = {
                scale: scale,
                canvas: canvas,
                logging: true,
                width: width,
                height: height
            };
            html2canvas(shareContent, opts).then(function (canvas) {
                var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height);
                Order.ImageList.push(img.src);

                if (pageCount < Order.CurrentPage) {
                    pageCount += 1;
                    Cnvert2CanvasItem("#content" + pageCount, pageCount);
                }
                else {
                    ExportToPdf();
                }
            });
        }
    }

    Order.ImageList = [];

    window.Order = Order;
})();