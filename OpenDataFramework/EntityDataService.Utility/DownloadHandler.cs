using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;

namespace EntityDataService.Utility
{
    /// <summary>
    /// DownloadHandler 的摘要说明
    /// </summary>
    public class DownloadHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            HttpResponse Response = context.Response;
            HttpRequest Request = context.Request;

            System.IO.Stream iStream = null;

            byte[] buffer = new Byte[10240];

            int length;

            long dataToRead;

            try
            {
                string filename = FileHelper.Decrypt(Request["fn"]); //通过解密得到文件名

                string filepath = HttpContext.Current.Server.MapPath("~/") + "Files/" + filename; //待下载的文件路径
                iStream = new System.IO.FileStream(filepath, System.IO.FileMode.Open,
                    System.IO.FileAccess.Read, System.IO.FileShare.Read);
                Response.Clear();

                dataToRead = iStream.Length;

                long p = 0;
                if (Request.Headers["Range"] != null)
                {
                    Response.StatusCode = 206;
                    p = long.Parse(Request.Headers["Range"].Replace("bytes=", "").Replace("-", ""));
                }
                if (p != 0)
                {
                    Response.AddHeader("Content-Range", "bytes " + p.ToString() + "-" + ((long)(dataToRead - 1)).ToString() + "/" + dataToRead.ToString());
                }
                Response.AddHeader("Content-Length", ((long)(dataToRead - p)).ToString());
                Response.ContentType = "application/octet-stream";
                Response.AddHeader("Content-Disposition", "attachment; filename=" + System.Web.HttpUtility.UrlEncode(System.Text.Encoding.GetEncoding(65001).GetBytes(Path.GetFileName(filename))));

                iStream.Position = p;
                dataToRead = dataToRead - p;

                while (dataToRead > 0)
                {
                    if (Response.IsClientConnected)
                    {
                        length = iStream.Read(buffer, 0, 10240);

                        Response.OutputStream.Write(buffer, 0, length);
                        Response.Flush();

                        buffer = new Byte[10240];
                        dataToRead = dataToRead - length;
                    }
                    else
                    {
                        dataToRead = -1;
                    }
                }
            }
            catch (Exception ex)
            {
                Response.Write("Error : " + ex.Message);
            }
            finally
            {
                if (iStream != null)
                {
                    iStream.Close();
                }
                Response.End();

            }
        }

        public bool IsReusable
        {
            get { return true; }
        }
    }
}