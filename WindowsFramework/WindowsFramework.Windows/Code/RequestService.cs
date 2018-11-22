using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Windows.Code
{
    public class RequestService
    {
        public static string PostRequest(string url, string requestContent)
        {
            Task<HttpResponseMessage> response = new HttpClient().PostAsync(url, new StringContent(requestContent, Encoding.UTF8, "application/json"));

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        private static string ToJson(object request)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            };

            return JsonConvert.SerializeObject(request, settings);
        }

        public static T PostRequestTo<T>(string url, object request) where T : class,new()
        {
            string requestContent = string.Empty;
            string responseContent = string.Empty;
            try
            {
                if (request != null) requestContent = ToJson(request);
                responseContent = PostRequest(url, requestContent);

                return JsonConvert.DeserializeObject<T>(responseContent);
            }
            catch (Exception ex)
            {
                ex = GetInnerException(ex);
                WriteLogInfo(url, requestContent, responseContent, ex);
                return null;
            }
        }

        private static void WriteLogInfo(string url, string requestContent, string responseContent, Exception ex)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict["Url"] = url;
            dict["RequestContent"] = requestContent;
            dict["ResponseContent"] = responseContent;

            LoggerProxy.WriteLog("Exception", "RequestService", "PostRequestTo", dict, ex);
        }

        public static Exception GetInnerException(Exception ex)
        {
            if (ex.InnerException != null) return GetInnerException(ex.InnerException);
            return ex;
        }
    }
}
