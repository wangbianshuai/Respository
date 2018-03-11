using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace AbetOrder.Web
{
    /// <summary>
    /// UploadHandler 的摘要说明
    /// </summary>
    public class UploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(this.Upload(context));
        }

        private string GetMessage(string message)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("Message", message);
            dict.Add("IsSuccess", false);
            return Code.Common.ToJson(dict);
        }

        private string Upload(HttpContext context)
        {
            try
            {
                string fileType = string.Empty;
                string fileName= string.Empty;
                string filePath = string.Empty;
                string fileSize = string.Empty;

                if (context.Request.Files.Count > 0)
                {
                    fileType = Path.GetExtension(context.Request.Files[0].FileName).ToLower();

                    fileSize = Code.Common.GetFileSize(context.Request.Files[0].ContentLength);

                    fileName = Path.GetFileName(context.Request.Files[0].FileName);

                    filePath = string.Format("StaticSource/{0}/{1}/", fileType.Replace(".", string.Empty), DateTime.Now.ToString("yyyy-MM-dd"));

                    string path =context.Server.MapPath(filePath);
                    filePath += fileName;

                    if (!Directory.Exists(path)) Directory.CreateDirectory(path);

                    path += fileName;

                    context.Request.Files[0].SaveAs(path);
                  
                    return Code.Common.ToJson(new { IsSuccess = true, FileName = fileName, FileSize = fileSize, FilePath = filePath });
                }
                else return this.GetMessage("未有上传文件！");
            }
            catch (Exception ex)
            {
                return this.GetMessage("上传失败，" + Code.Common.GetInnerException(ex).Message);
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