using EntityDataService.Service;
using EntityDataService.Utility;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace OpenDataFramework.WebApi.Code
{
    public class DataAccess
    {
        private OpenDataFramework.Component.IDataAccess _dataAccess;
        private EntityDataService.Service.Request _request;

        public DataAccess(EntityDataService.Service.Request request)
        {
            _request = request;
            _dataAccess = new OpenDataFramework.Component.DataAccess(_request);
        }

        public string RequestAction(string methodName)
        {
            methodName = methodName ?? string.Empty;
            switch (methodName.ToLower())
            {
                case "query": return EntityDataService.Entity.Parse.ToJson(_dataAccess.Query());
                case "create": return EntityDataService.Entity.Parse.ToJson(_dataAccess.Create());
                case "update": return EntityDataService.Entity.Parse.ToJson(_dataAccess.Update());
                case "delete": return EntityDataService.Entity.Parse.ToJson(_dataAccess.Delete());
                default: return string.Empty;
            }
        }

        public string GetJs(string name)
        {
            return this.GetJsCss(name, "js", "js");
        }

        public string GetSource(string name, string type)
        {
            return this.GetJsCss(name, type, "source");
        }

        public string GetJsCss(string name, string type, string type2)
        {
            string content = string.Empty;
            DateTime startTime = DateTime.Now;
            Stopwatch sw = new Stopwatch();
            sw.Start();
            string key = string.Empty;

            try
            {
                if (type2 == "js")
                {
                    key = "PageJs_js_" + name;
                    if (DataCache.JsList.ContainsKey(key))
                    {
                        content = DataCache.JsList[key];
                    }
                    else
                    {
                        string name2 = this.GetPageName(name);
                        if (!string.IsNullOrEmpty(name2))
                        {
                            name2 = this._request.RootPath + string.Format("Web\\configs\\pages\\{0}.js", name2);

                            using (TextReader reader = new StreamReader(name2))
                            {
                                content = reader.ReadToEnd();
                            }
                        }
                        else
                        {
                            content = _dataAccess.GetPageJs(name);
                        }

                        DataCache.JsList.AddOrUpdate(key, content, (a, b) => { return content; });
                    }
                }
                else if (type2 == "source")
                {
                    key = string.Format("{0}_{1}_{2}", type2, type, name);
                    if (type == "js" && DataCache.JsList.ContainsKey(key))
                    {
                        content = DataCache.JsList[key];
                    }
                    else if (type == "css" && DataCache.CssList.ContainsKey(key))
                    {
                        content = DataCache.CssList[key];
                    }
                    else
                    {
                        content = _dataAccess.GetSource(name, type);

                        if (type == "js")
                        {
                            DataCache.JsList.AddOrUpdate(key, content, (a, b) => { return content; });
                        }
                        else if (type == "css")
                        {
                            DataCache.CssList.AddOrUpdate(key, content, (a, b) => { return content; });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ex = Common.GetInnerException(ex);
                this._request.Excption = ex;
                content = ex.Message;

                this._request.EntityName = "资源";
                this._request.RequestType = "Query";
                this._request.StartTime = startTime;
                this._request.EndTime = DateTime.Now;
                sw.Stop();
                this._request.ElapsedMilliseconds = sw.ElapsedMilliseconds;

                Code.Request.AddRequestLog(this._request, string.Empty);
            }

            if (sw.IsRunning) sw.Stop();

            return content;
        }

        private string GetPageName(string name)
        {
            switch (name)
            {
                case "用户": return "User";
                case "表单": return "Entity";
                case "键值配置": return "KeyValue";
                case "页面": return "Page";
                case "操作日志": return "OperationLog";
                default: return "";
            }
        }
    }
}