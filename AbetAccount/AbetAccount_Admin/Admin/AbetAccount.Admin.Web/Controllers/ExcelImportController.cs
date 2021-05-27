using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AbetAccount.Admin.Web.Code;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenDataAccessCore.Utility;

namespace AbetAccount.Admin.Web.Controllers
{
    [Produces("application/json")]
    [Consumes("application/json", "multipart/form-data")]
    [Route("api/ExcelImportHandler")]
    [ApiExceptionFilter]
    [TokenFilter]
    public class ExcelImportController : Controller
    {
        public object ExcelUtility2 { get; private set; }

        [HttpPost]
        [ApiTokenParameter]
        public async Task<JsonResult> Post(string loginUserId, string sign, string appId)
        {
            return await Task.Run(() => Upload(loginUserId, sign, appId));
        }

        private JsonResult GetMessage(string message)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("Message2", message);
            dict.Add("IsSuccess", false);
            return this.Json(dict);
        }

        JsonResult Upload(string loginUserId, string sign, string appId)
        {
            try
            {
                var files = this.Request.Form.Files;
                string entityName = this.Request.Form["Entityname"];
               
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
            List<Dictionary<string, object>> messageList = new List<Dictionary<string, object>>();

            if (entityName == "AccountBill")
            {
                message = new Component.AccountBill().ExcelImport(dataList, loginUserId, messageList);
            }

            Dictionary<string, object> dict = new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(message)) dict.Add("Message2", message);
            if (messageList.Count > 0) dict.Add("MessageList", messageList);

            return dict;
        }

        private string ValidateColumn(List<string> list, string entityName)
        {
            List<string> nameList = null;
            string message = string.Empty;

            message += "导入格式：第一行为列名，数据从第二行开始；列名需与提示的列名一致，字母区分大小写。";

            if (entityName == "AccountBill")
            {
                nameList = new List<string>() { "日期", "账目名称", "类别", "收支", "金额", "摘要", "账户", "经手人" };
                message += "列名集合：" + string.Join("、", nameList);
            }

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

            if (entityName == "AccountBill")
            {
                nameList = new List<string>() { "日期", "账目名称", "类别", "收支", "金额" };
                message += "字段集合：" + string.Join("、", nameList) + "，不能为空";
            }

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