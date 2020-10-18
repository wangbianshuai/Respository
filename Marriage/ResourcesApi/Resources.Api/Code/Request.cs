using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Resources.Api.Code
{
    public class Request
    {
        public static string GetHeadersValue(HttpRequest request, string name)
        {
            if (!request.Headers.ContainsKey(name)) return string.Empty;
            var values = request.Headers.GetCommaSeparatedValues(name);
            if (values != null) return values.FirstOrDefault();
            return string.Empty;
        }

        public static string GetRequetContent(HttpRequest request)
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

        public static string GetHttpHost(HttpRequest request)
        {
            return string.Format("{0}://{1}{2}/", request.Scheme, request.Host.Value, request.PathBase.Value);
        }

        public static string GetClientIp(HttpRequest request)
        {
            return request.HttpContext.Connection.RemoteIpAddress.ToString();
        }
    }
}
