using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.ServiceModel.Channels;
using System.Web;
using System.Web.Http;

namespace StoryTestCases.Web.Code
{
    public class Request
    {
        public static OpenDataAccess.Service.Request GetRequest(ApiController controller, string entityName, string methodName, string userId)
        {
            OpenDataAccess.Service.Request request = new OpenDataAccess.Service.Request();

            request.Content = controller.Request.Content.ReadAsStringAsync().Result;
            request.IPAddress = GetClientIp(controller.Request);
            request.PathAndQuery = controller.Request.RequestUri.PathAndQuery;
            request.QueryString = GetQueryString(controller);
            request.RawUrl = controller.Request.RequestUri.AbsoluteUri;
            request.RootPath = AppDomain.CurrentDomain.BaseDirectory;
            request.RequestType = controller.Request.Method.Method;
            request.OperationUser = userId;

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

        public static string GetHeadersValue(HttpRequestMessage request, string name)
        {
            if (!request.Headers.Contains(name)) return string.Empty;
            var values = request.Headers.GetValues(name);
            if (values != null) return values.FirstOrDefault();
            return string.Empty;
        }
    }
}