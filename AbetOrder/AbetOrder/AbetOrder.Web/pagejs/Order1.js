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
            html.push("<div class=\"DivContent\" id=\"content1\">");

            html.push(GetHeaderHtml());

            html.push(GetCustomerUserHtml(data));

            html.push("<div class=\"DivName\"><span style=\"color:#666;\">订购门板花式：</span><span>" + data.OrderName + "</span></div>");

            html.push(GetOrderDetailsHtml(data));

            html.push("</div>");

            contentList.html(html.join(""));
        }

        function GetOrderDetailsHtml(data) {
            var html = [];

            html.push("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"DivDetail\">");

            data.Details = data.Details.sort(function (a, b) {
                return a.DisplayIndex > b.DisplayIndex ? 1 : -1;
            });

            for (var i = 0; i < data.Details.length; i++) {
                html.push(GetDetailRow(data.Details[i], i === data.Details.length - 1));
            }

            html.push(GetTotalRow(data));
            html.push(GetAmountTotalRow(data));
            html.push("</table>");

            return html.join("");
        }

        function GetAmountTotalRow(data) {
            var html = [];

            html.push("<tr>")

            html.push("<tr><td class=\"TdAmountTotal\" colspan=\"2\"><div>");
            html.push("<span style=\"color:#666;\">金额合计：（小写）</span>");
            html.push("<span style=\"margin-left:20px;\">" + data.ActualAmount + "</span>");
            html.push("<span style=\"color:#666;margin-left:20px;\">元</span>");
            html.push("<span style=\"color:#666;margin-left:80px;\">（大写）</span>");
            html.push("<span style=\"text-decoration:underline\">" + data.AmountUpper + "</span>");
            html.push("</div></td></tr>");

            return html.join("");
        }

        function GetTotalRow(data) {
            var html = [];

            html.push("<tr>")

            html.push("<tr><td class=\"TdTotal\" colspan=\"2\"><div>");
            html.push("<span style=\"color:#666;\">合计，面积(㎡)：</span>");
            html.push("<span>" + data.TotalArea + "</span>");
            html.push("<span style=\"color:#666;margin-left:20px;\">金额(RMB)：</span>");
            html.push("<span>" + data.ActualAmount + "</span>");
            html.push("<span style=\"color:#666;margin-left:20px;\">数量(件)：</span>");
            html.push("<span>" + data.TotalNumber + "</span>");
            html.push("</div></td></tr>");

            return html.join("");
        }

        function GetDetailRow(detail, blLast) {
            var html = [];

            html.push("<tr>")
            html.push("<td class=\"Td50\">" + GetLabelValue("序号", detail.DisplayIndex) + "</td>");
            html.push("<td class=\"Td50\">" + GetLabelValue("金额(RMB)", detail.Amount) + "</td>");
            if (detail.DetailType === 1) {
                html.push("<tr>")
                html.push("<td class=\"Td60\">" + GetLabelValue("面积(㎡)", detail.Height + "<span style=\"color:#666;\">(mm)×</span>" + detail.Width + "<span style=\"color:#666;\">(mm)×</span>" + detail.Number + "<span style=\"color:#666;\">=</span>" + detail.Area.toFixed(4)) + "</td>");
                html.push("<td class=\"Td40\">" + GetLabelValue("单价(元/㎡)", detail.Price) + "</td>");
                html.push("</tr>");
            }
            html.push("</tr>");

            if (blLast) html.push("<tr><td colspan=\"2\"><div>");
            else html.push("<tr><td class=\"TdRemark\" colspan=\"2\"><div>");
            html.push("<span style=\"color:#666;\">备注：</span>");
            html.push("<span>" + detail.Remark + "</span>");
            html.push("</div></td></tr>");

            return html.join("");
        }

        function GetLabelValue(label, value) {
            return "<span style=\"color:#666;\">" + label + "：</span><span>" + value + "</span>";
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
            html.push("<div class=\"DivTitle\"><span>销售订单</span></div>");
            html.push("<div class=\"DivLogo\"></div>");
            html.push("</div>");
            return html.join("");
        }

        function ExportToPdf(img) {
            var data = [];
            data.push(img.replace("data:image/png;base64,", ""));

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
            var shareContent = document.querySelector("#content1");
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
                ExportToPdf(img.src);
            });
        }
    }

    window.Order = Order;
})();