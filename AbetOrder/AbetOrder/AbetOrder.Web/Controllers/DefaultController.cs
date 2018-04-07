using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace AbetOrder.Web.Controllers
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
        public HttpResponseMessage Get(string entityName)
        {
            return Get(entityName, string.Empty);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Get(string entityName, string methodName)
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
        public async Task<HttpResponseMessage> Post(string entityName)
        {
            return await Task<HttpResponseMessage>.Run(() => { return this.RequestAction(entityName, string.Empty, false); });
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Post(string entityName, string methodName)
        {
            return await Task<HttpResponseMessage>.Run(() => { return this.RequestAction(entityName, methodName, false); });
        }

        /// <summary>
        /// 请求行为
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        public HttpResponseMessage RequestAction(string entityName, string methodName, bool blGet)
        {
            if (!JudgeRight()) return new HttpResponseMessage(HttpStatusCode.InternalServerError);

            Func<string, string, Type> getClassType = (classNamespace, className) =>
            {
                return Activator.CreateInstance(classNamespace, string.Format("{0}.{1}", classNamespace, className)).Unwrap().GetType();
            };

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(new OpenDataAccess.Service.RequestHandler().ProcessRequest(Code.Request.GetRequest(this, blGet), getClassType, entityName, methodName), Encoding.UTF8, "application/json")
            };
        }

        bool JudgeRight()
        {
            if (this.Request.Headers.Referrer == null) return false;

            if (this.Request.Headers.Referrer.Host != this.Request.RequestUri.Host) return false;

            if (this.Request.Headers.Referrer.LocalPath != "/" && !this.Request.Headers.Referrer.LocalPath.ToLower().Contains("default.aspx")) return false;

            return true;
        }
    }
}