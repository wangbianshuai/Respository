using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace DataDistribution.Service.Controllers
{
    public class DefaultController : ApiController
    {
        /// <summary>
        /// OPTIONS请求
        /// </summary>
        /// <returns></returns>
        public Task<HttpResponseMessage> Options()
        {
            return null;
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Get(string className, string methodName)
        {
            return await Task<HttpResponseMessage>.Run(() => { return GetData(className, methodName); });
        }

        HttpResponseMessage GetData(string className, string methodName)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

            try
            {
                byte[] bs = Code.DataStore.GetData(className, long.Parse(methodName));
                if (bs != null)
                {
                    response.Content = new StreamContent(new MemoryStream(bs));
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                }
            }
            catch (Exception ex)
            {
                ex = Code.Common.GetInnerException(ex);

                response.Content = new StringContent(ex.Message, Encoding.UTF8, "text/html");

                response.StatusCode = HttpStatusCode.InternalServerError;

                Code.LoggerProxy.Exception(className, methodName, ex);
            }

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
            return await Task<HttpResponseMessage>.Run(() => { return PostData(className, methodName); });
        }

        HttpResponseMessage PostData(string className, string methodName)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

            try
            {
                if (methodName.ToLower().Equals("setdata")) SetData(className);
                else if (methodName.ToLower().Equals("remove")) Code.DataStore.Remove(className); 
            }
            catch (Exception ex)
            {
                ex = Code.Common.GetInnerException(ex);

                response.Content = new StringContent(ex.Message, Encoding.UTF8, "text/html");

                response.StatusCode = HttpStatusCode.InternalServerError;

                Code.LoggerProxy.Exception(className, methodName, ex);
            }

            return response;
        }

        void SetData(string dataKey)
        {
            byte[] data = this.Request.Content.ReadAsByteArrayAsync().Result;
            if (data == null) return;

            string idList = Code.Common.GetParameterValue(this.Request, "IdList");
            List<long> userIdList = idList.Split(new char[] { ',', '，' }).Select(s => long.Parse(s)).ToList();

            Code.DataStore.SetData(dataKey, userIdList, data);
        }
    }
}