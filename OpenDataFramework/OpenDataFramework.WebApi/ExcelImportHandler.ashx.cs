using EntityDataService.Utility;
using OpenDataFramework.Component;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace OpenDataFramework.WebApi
{
    /// <summary>
    /// ExcelImportHandler 的摘要说明
    /// </summary>
    public class ExcelImportHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(this.ExcelImport(context));
        }


        private string ExcelImport(HttpContext context)
        {
            try
            {
                string entityName = context.Request.QueryString["EntityName"];
                string ft = context.Request.QueryString["ft"];
                int dataStatus = context.Request.QueryString["DataStatus"] == "1" ? 1 : 0;


                byte[] data = context.Request.BinaryRead(context.Request.ContentLength);
                Stream stream = new MemoryStream(data);

                if (data == null)
                {
                    return Code.Request.GetMessageResponse("未有上传文件！");
                }

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
                    return Code.Request.GetMessageResponse("对不起，未有相应数据！");
                }
                else
                {
                    EntityDataService.Service.Request request = Code.Request.GetRequest(context);
                    request.EntityName = entityName;

                    IDataAccess dataAccess = new DataAccess(request);

                    return EntityDataService.Entity.Parse.ToJson(dataAccess.ExcelImport(columnNameList, dataList, (byte)dataStatus));
                }
            }
            catch (Exception ex)
            {
                return Code.Request.GetExceptionResponse(ex);
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