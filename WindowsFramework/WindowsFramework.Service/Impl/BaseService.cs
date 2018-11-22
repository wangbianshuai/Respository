using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Utility;

namespace WindowsFramework.Service.Impl
{
    public class BaseService
    {
        private string PostRequest(string url, string requestJson)
        {
            Task<HttpResponseMessage> response = new HttpClient().PostAsync(url, new StringContent(requestJson, Encoding.UTF8, "application/json"));

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        private string ToJson(object request)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            };

            return JsonConvert.SerializeObject(request, settings);
        }

        public T PostRequest<T>(string url, object request, bool blRequestLog = true) where T : class,new()
        {
            string requestContent = string.Empty;
            return PostRequestTo<T>(url, request, out requestContent, blRequestLog);
        }

        private void WriteLogInfo(string url, string requestContent, string responseContent, string message, bool blRequestLog = true)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict["Url"] = url;
            dict["RequestContent"] = blRequestLog ? requestContent : string.Empty;
            dict["ResponseContent"] = responseContent;
            dict["Message"] = message;

            LoggerProxy.Info(dict);
        }

        public T PostRequestTo<T>(string url, object request, out string responseContent, bool blRequestLog = true) where T : class,new()
        {
            string requestContent = string.Empty;
            responseContent = string.Empty;
            try
            {
                requestContent = this.ToJson(request);
                responseContent = this.PostRequest(url, requestContent);

                if (typeof(T) == typeof(Dictionary<string, object>))
                {
                    return Common.JsonToDictionary(responseContent) as T;
                }
                else
                {
                    return JsonConvert.DeserializeObject<T>(responseContent) ?? Activator.CreateInstance<T>();
                }
            }
            catch (Exception ex)
            {
                ex = Common.GetInnerException(ex);
                this.WriteLogInfo(url, requestContent, responseContent, ex.Message, blRequestLog);

                throw ex;
            }
        }

        public Dictionary<string, object> PostRequestToDictionary(string url, object request, bool blRequestLog = true)
        {
            string responseContent = string.Empty;
            return this.PostRequestTo<Dictionary<string, object>>(url, request, out responseContent, blRequestLog);
        }

        /// <summary>
        /// 调用服务
        /// </summary>
        /// <param name="baseServiceUrl"></param>
        /// <param name="methodName"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public Dictionary<string, object> InvokeService(string baseServiceUrl, string methodName, object request)
        {
            string url = string.Concat(baseServiceUrl, "api/", methodName);

            Dictionary<string, object> d = this.PostRequestToDictionary(url, request);
            if (d != null && d.ContainsKey("Body"))
            {
                object body = d["Body"];
                if (body is Dictionary<string, object>)
                {
                    return body as Dictionary<string, object>;
                }
            }

            return d;
        }
    }
}
