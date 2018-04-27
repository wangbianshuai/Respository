$(document).ready(function () {
    $('#btnExportPdf').click(function () {
        Cnvert2Canvas();
    });
});

function ExportToPdf(img) {
    var data = [];
    data.push(img.replace("data:image/png;base64,", ""));

    $.ajax({
        url: "../ImageToPdfHandler.ashx",
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: JSON.stringify(data),
        success: function (a, b, c) {
            if (a.IsSuccess) window.open("../" + a.FileName, "_blank");
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
