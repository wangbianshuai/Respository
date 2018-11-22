using OpenDataAccess.Entity;
using OpenDataAccess.Utility;
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
            string entityName = Code.Common.GetParameterValue(context.Request.QueryString, "EntityName");
            context.Response.ContentType = "text/plain";
            if (entityName == "OrderExcelImport") context.Response.Write(this.OrderExcelImport(context));
            else context.Response.Write(this.Upload(context));
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
                string fileType = Code.Common.GetParameterValue(context.Request.QueryString, "ft");
                string fileName = string.Empty;
                string filePath = Code.Common.GetParameterValue(context.Request.QueryString, "fp");
                string fileSize = string.Empty;

                if (context.Request.Files.Count > 0)
                {
                    if (string.IsNullOrEmpty(fileType)) fileType = "html";

                    fileSize = Common.GetFileSize(context.Request.Files[0].ContentLength);

                    if (string.IsNullOrEmpty(filePath))
                    {
                        string ext = Path.GetExtension(context.Request.Files[0].FileName);
                        filePath = string.Format("resouces/{0}/", fileType);
                        fileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + new Random().Next(100000, 999999) + ext;
                    }
                    else
                    {
                        fileName = Path.GetFileName(filePath);
                        filePath = filePath.Replace(fileName, string.Empty);
                    }

                    string path = context.Server.MapPath(filePath);
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

        string OrderExcelImport(HttpContext context)
        {
            try
            {
                if (context.Request.Files.Count == 0) return GetMessage("未有上传文件！");

                var file = context.Request.Files[0];

                string ft = Path.GetExtension(file.FileName).ToLower();

                byte[] bs = new byte[file.ContentLength];
                file.InputStream.Read(bs, 0, file.ContentLength);

                Stream stream = new MemoryStream(bs);

                Func<List<string>, string> validateColumn = (list) =>
                {
                    return string.Empty;
                };

                Func<Dictionary<string, string>, string> validateData = (dict) =>
                {
                    return string.Empty;
                };

                List<List<Dictionary<string, string>>> dataList = null;
                List<string> columnNameList = null;
                List<string> dateColumnNameList = new List<string>();

                if (ft == ".xls")
                {
                    dataList = new List<List<Dictionary<string, string>>>();
                    dataList.Add(ExcelUtility2.Excel2003Import(stream, out columnNameList, validateColumn, validateData, 10000));
                }
                else
                {
                    dataList = ExcelUtility2.Excel2007Import(stream, out columnNameList, dateColumnNameList, validateColumn, validateData, 10000);
                }
                if (dataList.Count == 0)
                {
                    return GetMessage("对不起，未有相应数据！");
                }
                else
                {
                    Component.Order order = new Component.Order();

                    return Parse.ToJson(order.ExcelImportDetail(columnNameList, dataList));
                }
            }
            catch (Exception ex)
            {
                return this.GetMessage("导入失败，" + Code.Common.GetInnerException(ex).Message);
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