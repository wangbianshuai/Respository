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

namespace DataDistribution.Service.Controllers
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
        public async Task<JsonResult<object>> Post(string className, string methodName)
        {
            return await Task.Run<JsonResult<object>>(() => { return this.RequestAction(className, methodName); });
        }

        /// <summary>
        /// 请求行为
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        private JsonResult<object> RequestAction(string className, string methodName)
        {
            return null;
        }
    }
}