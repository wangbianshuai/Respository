using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace AbetAccount.Admin.Web.Code
{
    public class Request
    {
        public string RequestConent { get; set; }
        public string EntityName { get; set; }
        public string MethodName { get; set; }
        public string RequestIP { get; set; }
        public string RootPath { get; set; }
        public HttpRequest HttpRequest { get; set; }
        public byte[] RequestBytes { get; set; }
        public string RequestUrl { get; set; }

        private static List<string> _DirectRequestList { get; set; }
        public static List<string> HtmlPageNameList { get; set; }

        static Request()
        {
            EntityType.SetEntityType<Entity.AdminUser>();
            EntityType.SetEntityType<Entity.ViewAdminUser>();
            EntityType.SetEntityType<Entity.DictionaryConfig>();
            EntityType.SetEntityType<Entity.ViewDictionaryConfig>();
            EntityType.SetEntityType<Entity.OperationLog>();
            EntityType.SetEntityType<Entity.ViewOperationLog>();
            EntityType.SetEntityType<Entity.AccountType>();
            EntityType.SetEntityType<Entity.ViewAccountType>();
            EntityType.SetEntityType<Entity.Customer>();
            EntityType.SetEntityType<Entity.ViewCustomer>();
            EntityType.SetEntityType<Entity.AccountBill>();
            EntityType.SetEntityType<Entity.ViewAccountBill>();


            OpenDataAccessCore.Service.ComponentType.SetComponentType<Component.DictionaryConfig>();
            OpenDataAccessCore.Service.ComponentType.SetComponentType<Component.AdminUser>();
            OpenDataAccessCore.Service.ComponentType.SetComponentType<Component.AccountType>();
            OpenDataAccessCore.Service.ComponentType.SetComponentType<Component.Customer>();
            OpenDataAccessCore.Service.ComponentType.SetComponentType<Component.AccountBill>();

            _DirectRequestList = new List<string>()
            {
            };

            HtmlPageNameList = new List<string>() {
                "index"
            };
        }
        public static OpenDataAccessCore.Service.Request GetRequest(ControllerBase controller, string requestType, string entityName, string methodName, string useId, IWebHostEnvironment webHostEnvironment, string sign, string appId)
        {
            OpenDataAccessCore.Service.Request request = new OpenDataAccessCore.Service.Request();

            request.Content = GetRequetContent(controller.Request);
            request.IPAddress = GetClientIp(controller.Request);
            request.OperationUser = GetParameterValue(controller.Request, "LoginUserId");
            request.PathAndQuery = controller.Request.Path;
            request.QueryString = GetQueryString(controller);
            request.RawUrl = controller.Request.Path;
            request.RootPath = webHostEnvironment.WebRootPath + "/";
            request.RequestType = requestType;
            request.OperationUser = useId;
            request.Sign = sign;
            request.AppId = appId;
            request.IsDirectRequest = () => JudgeDirectRequest(entityName, string.IsNullOrEmpty(methodName) ? string.Empty : methodName);

            int index = request.PathAndQuery.IndexOf("api/");
            if (index >= 0)
            {
                request.PathInfo = index == 0 ? string.Empty : request.PathAndQuery.Substring(index + 4);
            }
            else
            {
                request.PathInfo = request.PathAndQuery;
            }

            return request;
        }

        public static string GetClientIp(HttpRequest request)
        {
            return request.HttpContext.Connection.RemoteIpAddress.ToString();
        }

        private static NameValueCollection GetQueryString(ControllerBase controller)
        {
            NameValueCollection collection = new NameValueCollection();
            foreach (var kvp in controller.Request.Query)
            {
                collection.Add(kvp.Key, kvp.Value.FirstOrDefault().Trim());
            }
            return collection;
        }

        public static bool JudgeDirectRequest(string entityName, string methodName)
        {
            methodName = methodName.Split('(')[0];
            return _DirectRequestList.Contains(string.Concat(entityName.ToLower(), "/", methodName.ToLower()));
        }


        public static string GetParameterValue(HttpRequest request, string name)
        {
            var kvp = request.Query.Where(w => w.Key.ToLower() == name.ToLower()).FirstOrDefault();
            if (!string.IsNullOrEmpty(kvp.Value))
            {
                if (kvp.Value == "undefined")
                {
                    return string.Empty;
                }
                else
                {
                    return HttpUtility.UrlDecode(kvp.Value.FirstOrDefault().Trim());
                }
            }

            return string.Empty;
        }

        private static string GetRequetContent(HttpRequest request)
        {
            string requestContent = string.Empty;
            request.EnableBuffering();
            using (var reader = new StreamReader(request.Body, encoding: Encoding.UTF8))
            {
                requestContent = reader.ReadToEndAsync().Result;
                request.Body.Position = 0;
            }

            return requestContent;
        }

        private static void ExceptionToWarnLog(Exception ex, Controller controller, Request request, string className, string methodName)
        {
            Dictionary<string, object> message = new Dictionary<string, object>();

            message["Title"] = string.Format("AbetAccount.Admin.Web.{0}.{1}.Exception", className, methodName);
            message["Url"] = request == null ? controller.Request.Path.ToString() : request.RequestUrl;
            message["RequestContent"] = request == null ? GetRequetContent(controller.Request) : request.RequestConent;

            Utility.LoggerProxy.Exception("Request", "ExceptionToWarnLog", ex, message);
        }

        public static string GetHeadersValue(HttpRequest request, string name)
        {
            if (!request.Headers.ContainsKey(name)) return string.Empty;
            return request.Headers[name].ToString();
        }
    }
}