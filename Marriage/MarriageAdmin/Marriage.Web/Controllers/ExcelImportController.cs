using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenDataAccessCore.Utility;

namespace Marriage.Web.Controllers
{
    [Produces("application/json")]
    [Consumes("application/json", "multipart/form-data")]
    [Route("ExcelImportHandler.ashx")]
    public class ExcelImportController : Controller
    {
        public object ExcelUtility2 { get; private set; }

        [HttpPost]
        public async Task<JsonResult> Post()
        {
            return await Task.Run(() => Upload());
        }

        private JsonResult GetMessage(string message)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("Message2", message);
            dict.Add("IsSuccess", false);
            return this.Json(dict);
        }

        JsonResult Upload()
        {
            try
            {
                var files = this.Request.Form.Files;
                string entityName = Code.Request.GetParameterValue(this.Request, "EntityName");
                string loginUserId = Code.Request.GetParameterValue(this.Request, "LoginUserId");

                if (files.Count > 0)
                {
                    string ft = Path.GetExtension(files[0].FileName).ToLower();

                    if (ft != ".xlsx") return GetMessage("目前只支持Excel2007或更高版本的.xlsx文件！");

                    MemoryStream ms = new MemoryStream();
                    files[0].CopyTo(ms);
                    ms.Flush();
                    ms.Position = 0;

                    Func<List<string>, string> validateColumn = (list) =>
                    {
                        return this.ValidateColumn(list, entityName);
                    };

                    Func<Dictionary<string, object>, string> validateData = (dict) =>
                    {
                        return this.ValidateData(dict, entityName);
                    };

                    List<Dictionary<string,object>> dataList = ExcelUtility.Excel2007Import(ms, validateColumn, validateData, 10000);

                    if (dataList.Count == 0) return GetMessage("对不起，未有相应数据！");

                    return this.Json(ImportData(dataList, entityName, loginUserId));
                }
                else return this.GetMessage("未有上传文件！");
            }
            catch (Exception ex)
            {
                return this.GetMessage("上传失败，" + Common.GetInnerException(ex).Message);
            }
        }

        object ImportData(List<Dictionary<string, object>> dataList, string entityName, string loginUserId)
        {
            string message = string.Empty;
            List<Dictionary<string, object>> messageList = null;

            //switch (entityName)
            //{
               
            //}

            if (messageList != null)
            {
                Dictionary<string, object> dict = new Dictionary<string, object>();
                if (!string.IsNullOrEmpty(message)) dict.Add("Message2", message);
                dict.Add("MessageList", messageList);

                return dict;
            }

            return null;
        }

        private string ValidateColumn(List<string> list, string entityName)
        {
            List<string> nameList = null;
            string message = string.Empty;
           
            message += "导入格式：第一行为列名，数据从第二行开始；列名需与提示的列名一致，字母区分大小写。";

            int iCount = (from a in list
                          from b in nameList
                          where a == b
                          select a).Count();

            if (iCount != nameList.Count) return message;

            return string.Empty;
        }

        private string ValidateData(Dictionary<string, object> dict, string entityName)
        {
            List<string> nameList = null;
            string message = string.Empty;
            
            bool blSucceed = true;

            foreach (string name in nameList)
            {
                if (!dict.ContainsKey(name) || dict[name] == null || string.IsNullOrEmpty(dict[name].ToString())) { blSucceed = false; break; }
            }

            if (!blSucceed) return message;

            return string.Empty;
        }
    }
}