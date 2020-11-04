using Marriage.Utility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Service.Impl
{
    public class BaseService
    {
        private string PostRequest(string url, string requestJson, Dictionary<string, string> headers)
        {
            url = Common.AddUrlRandom(url);
            HttpClient client = new HttpClient();
            if (headers != null)
            {
                foreach (var kvp in headers) client.DefaultRequestHeaders.Add(kvp.Key, kvp.Value);
            }
            Task<HttpResponseMessage> response = client.PostAsync(url, new StringContent(requestJson, Encoding.UTF8, "application/json"));

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        private string PostRequest(string url, Stream content, Dictionary<string, string> headers)
        {
            url = Common.AddUrlRandom(url);
            HttpClient client = new HttpClient();
            if (headers != null)
            {
                foreach (var kvp in headers) client.DefaultRequestHeaders.Add(kvp.Key, kvp.Value);
            }
            client.Timeout = new TimeSpan(0, 30, 0);
            Task<HttpResponseMessage> response = client.PostAsync(url, new StreamContent(content));

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        private string PutRequest(string url, string requestJson, Dictionary<string, string> headers)
        {
            url = Common.AddUrlRandom(url);
            HttpClient client = new HttpClient();
            if (headers != null)
            {
                foreach (var kvp in headers) client.DefaultRequestHeaders.Add(kvp.Key, kvp.Value);
            }
            Task<HttpResponseMessage> response = client.PutAsync(url, new StringContent(requestJson, Encoding.UTF8, "application/json"));

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        private string DeleteRequest(string url, Dictionary<string, string> headers)
        {
            url = Common.AddUrlRandom(url);
            HttpClient client = new HttpClient();
            if (headers != null)
            {
                foreach (var kvp in headers) client.DefaultRequestHeaders.Add(kvp.Key, kvp.Value);
            }
            Task<HttpResponseMessage> response = client.DeleteAsync(url);

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        private string GetRequest(string url, Dictionary<string, string> headers)
        {
            url = Common.AddUrlRandom(url);
            HttpClient client = new HttpClient();
            if (headers != null)
            {
                foreach (var kvp in headers) client.DefaultRequestHeaders.Add(kvp.Key, kvp.Value);
            }
            Task<HttpResponseMessage> response = client.GetAsync(url);

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        public T PostRequest<T>(string url, object request, Dictionary<string, string> headers = null, bool blRequestLog = true) where T : class, new()
        {
            string responseContent = string.Empty;
            return RequestTo<T>(url, request, out responseContent, "Post", headers, blRequestLog);
        }

        public T PutRequest<T>(string url, object request, Dictionary<string, string> headers = null, bool blRequestLog = true) where T : class, new()
        {
            string responseContent = string.Empty;
            return RequestTo<T>(url, request, out responseContent, "Put", headers, blRequestLog);
        }

        public T DeleteRequest2<T>(string url, Dictionary<string, string> headers = null, bool blRequestLog = true) where T : class, new()
        {
            string responseContent = string.Empty;
            return RequestTo<T>(url, null, out responseContent, "Delete", headers, blRequestLog);
        }

        public T GetRequest2<T>(string url, Dictionary<string, string> headers = null, bool blRequestLog = true) where T : class, new()
        {
            string responseContent = string.Empty;
            return RequestTo<T>(url, null, out responseContent, "Get", headers, blRequestLog);
        }

        public T GetRequest2<T>(string url, out string responseContent, Dictionary<string, string> headers = null, bool blRequestLog = true) where T : class, new()
        {
            responseContent = string.Empty;
            return RequestTo<T>(url, null, out responseContent, "Get", headers, blRequestLog);
        }

        private void WriteLogInfo(string url, string requestContent, string responseContent, string message, bool blRequestLog = true)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict["Url"] = url;
            dict["RequestContent"] = blRequestLog ? requestContent : string.Empty;
            dict["ResponseContent"] = responseContent;
            dict["Message"] = message;

            LoggerProxy.Info(this.GetType().Name, "WriteLogInfo", dict);
        }

        public string Request(string url, object request, string method, Dictionary<string, string> headers, bool blRequestLog = true)
        {
            string requestContent = string.Empty;
            string responseContent = string.Empty;
            try
            {
                requestContent = Common.ToJson(request);
                if (method == "Put") responseContent = this.PutRequest(url, requestContent, headers);
                else if (method == "Delete") responseContent = this.DeleteRequest(url, headers);
                else if (method == "Get") responseContent = this.GetRequest(url, headers);
                else responseContent = this.PostRequest(url, requestContent, headers);

                return responseContent;
            }
            catch (Exception ex)
            {
                ex = Common.GetInnerException(ex);
                this.WriteLogInfo(url, requestContent, responseContent, ex.Message, blRequestLog);

                throw ex;
            }
        }

        public T RequestTo<T>(string url, object request, out string responseContent, string method, Dictionary<string, string> headers, bool blRequestLog = true)
            where T : class, new()
        {
            responseContent = Request(url, request, method, headers, blRequestLog);

            return Common.JsonToObject<T>(responseContent) ?? Activator.CreateInstance<T>();
        }


        public T RequestTo<T, S>(string url, object request, out string responseContent, string method, Dictionary<string, string> headers, bool blRequestLog = true)
            where T : class, Entity.Service.IResponse, new()
            where S : class, new()
        {

            responseContent = Request(url, request, method, headers, blRequestLog);

            if (responseContent.StartsWith("{"))
            {
                return Common.JsonToObject<T>(responseContent) ?? Activator.CreateInstance<T>();
            }
            else
            {
                var list = Common.JsonToObject<List<S>>(responseContent) ?? Activator.CreateInstance<List<S>>();

                T response = Activator.CreateInstance<T>();

                var property = typeof(T).GetProperties().Where(w => w.Name == "data").FirstOrDefault();
                if (property != null) property.SetValue(response, list);

                return response;
            }
        }

        public T GetRequestToList<T, S>(string url, Dictionary<string, string> headers = null)
            where T : class, Entity.Service.IResponse, new()
            where S : class, new()
        {
            string responseContent = string.Empty;
            return RequestTo<T, S>(url, null, out responseContent, "Get", headers);
        }

        public string PostStreamRequest(string url, byte[] data, Dictionary<string, string> headers = null, bool blRequestLog = true)
        {
            string responseContent = string.Empty;
            try
            {
                responseContent = this.PostRequest(url, new MemoryStream(data), headers);

                return responseContent;
            }
            catch (Exception ex)
            {
                ex = Common.GetInnerException(ex);
                this.WriteLogInfo(url, string.Empty, responseContent, ex.Message, blRequestLog);

                throw ex;
            }
        }
    }
}
