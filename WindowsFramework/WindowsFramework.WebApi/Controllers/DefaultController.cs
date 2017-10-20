using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace WindowsFramework.WebApi.Controllers
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
            object obj = null;

            try
            {
                if (className.ToLower().Equals("app") && methodName.ToLower().Equals("getversion"))
                {
                    obj = this.GetVersion();
                }
            }
            catch (Exception ex)
            {
                obj = new { Ack = new { IsSuccess = false, StatusCode = 101, StatusMessage = ex.Message } };
            }

            return this.Json<object>(obj);
        }

        private object GetVersion()
        {
            return new
            {
                Ack = new { IsSuccess = true, StatusCode = 0, StatusMessage = string.Empty },
                BinVersion = ConfigurationManager.AppSettings["BinVersion"],
                ConfigsVersion = ConfigurationManager.AppSettings["ConfigsVersion"],
                ImagesVersion = ConfigurationManager.AppSettings["ImagesVersion"]
            };
        }
    }
}