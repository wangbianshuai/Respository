using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.ServiceModel.Channels;
using System.Web;
using System.Web.Http;

namespace AbetOrder.Web.Code
{
    public class Request
    {
        static List<string> _DirectRequestList { get; set; }

        static Request()
        {
            _DirectRequestList = new List<string>()
            {
                "vieworder/getorder2"
            };
        }

        public static OpenDataAccess.Service.Request GetRequest(ApiController controller, bool blGet, string entityName, string methodName)
        {
            OpenDataAccess.Service.Request request = new OpenDataAccess.Service.Request();

            request.Content = controller.Request.Content.ReadAsStringAsync().Result;
            request.IPAddress = GetClientIp(controller.Request);
            request.OperationUser = GetParameterValue(controller.Request, "LoginUserId");
            request.PathAndQuery = controller.Request.RequestUri.PathAndQuery;
            request.QueryString = GetQueryString(controller);
            request.RawUrl = controller.Request.RequestUri.AbsoluteUri;
            request.RootPath = AppDomain.CurrentDomain.BaseDirectory;
            request.RequestType = blGet ? "GET" : "POST";
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

        public static bool JudgeDirectRequest(string entityName, string methodName)
        {
            methodName = methodName.Split('(')[0];
            return _DirectRequestList.Contains(string.Concat(entityName.ToLower(), "/", methodName.ToLower()));
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
                RemoteEndpointMessageProperty prop;
                prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
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
    }
}