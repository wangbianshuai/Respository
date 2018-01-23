using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace OpenDataAppConfig.WebApi.Controllers
{
    public class DefaultController : ApiController
    {
        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Get(string className)
        {
            return await Task<HttpResponseMessage>.Run(() => { return GetJsonString(className); });
        }

        HttpResponseMessage GetJsonString(string className)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

            try
            {
                string content = string.Empty;
                if (!string.IsNullOrEmpty(className)) content = (string)ExecuteScript("GetJsonString()", GetJsCode(className));
                response.Content = new StringContent(content, Encoding.UTF8, "application/json");
            }
            catch (Exception ex)
            {
                ex = Code.Common.GetInnerException(ex);

                response.Content = new StringContent(ex.Message, Encoding.UTF8, "text/html");

                response.StatusCode = HttpStatusCode.InternalServerError;

                Code.LoggerProxy.Exception(className, "GetJsonString", ex);
            }

            return response;
        }

        string GetJsCode(string name)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("var window={};window.configs = {};");

            string dirPath = AppDomain.CurrentDomain.BaseDirectory;


            using (TextReader reader = new StreamReader(string.Format("{0}configs\\{1}.js", dirPath, name)))
            {
                string content = reader.ReadToEnd();
                sb.AppendLine(content);
            }

            using (TextReader reader = new StreamReader(string.Format("{0}js\\json2.js", dirPath)))
            {
                sb.AppendLine(reader.ReadToEnd());
            }

            sb.AppendLine(GetFunctionJs(name));
            return sb.ToString();
        }


        private void CopyContent(string content, string name)
        {

            try
            {
                string dirPath = AppDomain.CurrentDomain.BaseDirectory + "dist";

                string path = dirPath + string.Format("\\configs\\{0}.json", name);

                using (TextWriter writer = new StreamWriter(path))
                {
                    writer.Write(content);
                    writer.Flush();
                }
            }
            catch
            {
            }
        }
        private string GetFunctionJs(string name)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("function GetJsonString(){");
            sb.AppendLine(string.Format("return JSON.stringify(window.configs[\"{0}\"])", name));
            sb.AppendLine("}");
            return sb.ToString();
        }

        private object ExecuteScript(string sExpression, string sCode)
        {
            MSScriptControl.ScriptControl scriptControl = new MSScriptControl.ScriptControl();
            scriptControl.UseSafeSubset = true;
            scriptControl.Language = "JScript";
            scriptControl.AddCode(sCode);
            try
            {
                return scriptControl.Eval(sExpression);
            }
            catch
            {

            }
            return null;
        }
    }
}