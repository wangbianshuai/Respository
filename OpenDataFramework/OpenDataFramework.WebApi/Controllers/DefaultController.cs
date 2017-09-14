using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace OpenDataFramework.WebApi.Controllers
{
    public class DefaultController : ApiController
    {
        /// <summary>
        /// OPTIONS请求
        /// </summary>
        /// <returns></returns>
        public string Options()
        {
            return null;
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Get()
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(Convert.FromBase64String("R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw=="))
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/gif");

            return response;
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Post(string className, string methodName)
        {
            return await Task.Run<HttpResponseMessage>(() => { return this.RequestAction(className, methodName); });
        }

        /// <summary>
        /// 请求行为
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        private HttpResponseMessage RequestAction(string className, string methodName)
        {
            string content = string.Empty;

            EntityDataService.Service.Request request = null;
            DateTime startTime = DateTime.Now;
            Stopwatch sw = new Stopwatch();
            sw.Start();

            try
            {
                if (className.ToLower() == "dataaccess")
                {
                    request = Code.Request.GetRequest(this);
                    content = new Code.DataAccess(request).RequestAction(methodName);
                }
            }
            catch (Exception ex)
            {
                if (request != null) request.Excption = ex;
                content = Code.Request.GetExceptionResponse(ex);
            }

            if (string.IsNullOrEmpty(content))
            {
                content = Code.Request.GetEmptyResponse();
            }

            if (request != null)
            {
                request.StartTime = startTime;
                request.EndTime = DateTime.Now;
                sw.Stop();
                request.ElapsedMilliseconds = sw.ElapsedMilliseconds;

                Code.Request.AddRequestLog(request, content);
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(content, Encoding.UTF8, "application/json")
            };
        }
    }
}