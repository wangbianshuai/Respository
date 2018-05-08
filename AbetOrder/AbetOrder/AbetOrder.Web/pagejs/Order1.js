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

            html.push("</div>");

            contentList.html(html.join(""));
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