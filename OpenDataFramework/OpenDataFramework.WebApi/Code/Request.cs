using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.ServiceModel.Channels;
using EntityDataService.Utility;
using System.Threading.Tasks;
using EntityDataService.Service;

namespace OpenDataFramework.WebApi.Code
{
    public class Request
    {
        public static EntityDataService.Service.Request GetRequest(ApiController controller)
        {
            EntityDataService.Service.Request request = new EntityDataService.Service.Request();

            request.Content = controller.Request.Content.ReadAsStringAsync().Result;
            request.IPAddress = GetClientIp(controller.Request);
            request.OperationUser = GetParameterValue(controller.Request, "LoginUserId");
            request.PathAndQuery = controller.Request.RequestUri.PathAndQuery;
            request.QueryString = GetQueryString(controller);
            request.IsLogin = GetParameterValue(controller.Request, "IsLogin") == "true";
            request.RawUrl = controller.Request.RequestUri.AbsoluteUri;
            request.RootPath = AppDomain.CurrentDomain.BaseDirectory;

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

        public static EntityDataService.Service.Request GetRequest(HttpContext context)
        {
            EntityDataService.Service.Request request = new EntityDataService.Service.Request();

            request.IPAddress = Common.GetRealIP(new HttpContextWrapper(context).Request);
            request.OperationUser = GetParameterValue(context, "LoginUserId");
            request.PathAndQuery = context.Request.Url.PathAndQuery;
            request.QueryString = context.Request.QueryString;
            request.QueryString.Add(context.Request.Form);
            request.RawUrl = context.Request.RawUrl;
            request.RootPath = AppDomain.CurrentDomain.BaseDirectory;

            return request;
        }

        private static NameValueCollection GetQueryString(ApiController controller)
        {
            NameValueCollection collection = new NameValueCollection();
            foreach (var kvp in controller.Request.GetQueryNameValuePairs())
            {
                collection.Add(kvp.Key, kvp.Value);
            }
            return collection;
        }

        private static string GetClientIp(HttpRequestMessage request)
        {
            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }

            if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            {
                RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
                return prop.Address;
            }

            return null;
        }

        public static string GetParameterValue(HttpRequestMessage request, string name)
        {
            KeyValuePair<string, string> kvp = request.GetQueryNameValuePairs().Where(w => w.Key.ToLower() == name.ToLower()).FirstOrDefault();
            if (!string.IsNullOrEmpty(kvp.Value))
            {
                if (kvp.Value == "undefined")
                {
                    return string.Empty;
                }
                else
                {
                    return HttpUtility.UrlDecode(kvp.Value.Trim());
                }
            }

            return string.Empty;
        }

        public static string GetParameterValue(HttpContext context, string name)
        {
            string key = context.Request.QueryString.AllKeys.Where(where => where.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
            if (key != null)
            {
                if (context.Request.QueryString[key] == "undefined")
                {
                    return string.Empty;
                }
                else
                {
                    return HttpUtility.UrlDecode(context.Request.QueryString[key].Trim());
                }
            }
            else
            {
                return string.Empty;
            }
        }

        public static string GetEmptyResponse()
        {
            return GetStatusMessageResponse(100, "实体方法未实现");
        }

        public static string GetMessageResponse(string message)
        {
            return GetStatusMessageResponse(102, message);
        }

        private static string GetStatusMessageResponse(int code, string message)
        {
            Response response = new Response();
            response.Ack.IsSuccess = false;
            response.Ack.StatusCode = code;
            response.Ack.StatusMessage = message;
            return Newtonsoft.Json.JsonConvert.SerializeObject(response);
        }

        public static string GetExceptionResponse(Exception ex)
        {
            ex = Common.GetInnerException(ex);
            return GetStatusMessageResponse(101, ex.Message);
        }

        public static async void AddRequestLog(EntityDataService.Service.Request request, string content)
        {
            try
            {
                await Task.Run(() => { RequestLog.WriteRequestLog(request, content); });
            }
            catch
            {
            }
        }

        public static string GetKeyValue(string key)
        {
            OpenDataFramework.Component.IDataAccess dataAccess = new OpenDataFramework.Component.DataAccess();
            return dataAccess.GetKeyValue(key);
        }

        public static string GetSource(string name, string type)
        {
            OpenDataFramework.Component.IDataAccess dataAccess = new OpenDataFramework.Component.DataAccess();
            return dataAccess.GetSource(name, type);
        }
    }
}