using OpenDataAccess.Service;
using OpenDataAccess.Utility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StoryTestCases.Web
{
    public partial class download : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string fn = this.Request.QueryString["fn"];
            if (!string.IsNullOrEmpty(fn))
            {
                this.ExcelExport(fn);
            }
        }

        private void ExcelExport(string fn)
        {
            string fileName = FileHelper.Decrypt(fn);

            ExcelExportData execlExportData = DataCache.GetExcelExportData(fileName);

            if (execlExportData != null)
            {
                MemoryStream stream = null;
                try
                {
                    stream = ExcelUtility2.ExportExcel2003(execlExportData.DataList, execlExportData.HeadDictionary);
                    ProcessRequest(stream, fileName);
                }
                catch (Exception ex)
                {
                    this.Response.ContentType = "text/html";
                    this.Response.Write("下载异常：" + Common.GetInnerException(ex).Message);
                }
                finally
                {
                    if (stream != null)
                    {
                        stream.Close();
                    }
                    this.Response.End();
                }
            }
        }

        private void ProcessRequest(MemoryStream stream, string filename)
        {
            byte[] buffer = new Byte[10240];

            int length = 0;

            long dataToRead = 0;

            filename += ".xls";

            dataToRead = stream.Length;

            long p = 0;
            if (this.Request.Headers["Range"] != null)
            {
                this.Response.StatusCode = 206;
                p = long.Parse(Request.Headers["Range"].Replace("bytes=", "").Replace("-", ""));
            }
            if (p != 0)
            {
                this.Response.AddHeader("Content-Range", "bytes " + p.ToString() + "-" + ((long)(dataToRead - 1)).ToString() + "/" + dataToRead.ToString());
            }
            this.Response.AddHeader("Content-Length", ((long)(dataToRead - p)).ToString());
            this.Response.AddHeader("Content-Disposition", "attachment; filename=" + System.Web.HttpUtility.UrlEncode(System.Text.Encoding.GetEncoding(65001).GetBytes(Path.GetFileName(filename))));
            this.Response.ContentType = "application/octet-stream";
            this.Response.Clear();

            stream.Position = p;
            dataToRead = dataToRead - p;

            while (dataToRead > 0)
            {
                if (this.Response.IsClientConnected)
                {
                    length = stream.Read(buffer, 0, 10240);

                    this.Response.OutputStream.Write(buffer, 0, length);
                    this.Response.Flush();

                    buffer = new Byte[10240];
                    dataToRead = dataToRead - length;
                }
                else
                {
                    dataToRead = -1;
                }
            }
        }
    }
}