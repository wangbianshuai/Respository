using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AbetOrder.Web
{
    /// <summary>
    /// ImageToPdfHandler 的摘要说明
    /// </summary>
    public class ImageToPdfHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(ImageToPdf(context));
        }

        string ImageToPdf(HttpContext context)
        {
            try
            {
                string content = context.Request.ContentEncoding.GetString(context.Request.BinaryRead(context.Request.ContentLength));

                List<string> list = OpenDataAccess.Utility.Common.JsonTo<List<string>>(content);

                List<byte[]> imageList = (from a in list
                                          select Convert.FromBase64String(a)).ToList();

                string fileName = "PdfFiles/" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".pdf";

                OpenDataAccess.Utility.PdfDocument.CreatePdfFromImage(imageList, context.Server.MapPath(fileName));

                return OpenDataAccess.Utility.Common.ToJson(new { FileName = fileName, IsSuccess = true });
            }
            catch (Exception ex)
            {
                return OpenDataAccess.Utility.Common.ToJson(new { Message = Code.Common.GetInnerException(ex).Message, IsSuccess = false });
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}