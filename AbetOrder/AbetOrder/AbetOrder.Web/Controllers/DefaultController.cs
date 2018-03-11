using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
        public async Task<HttpResponseMessage> Get(string entityName)
        {
            return await Task<HttpResponseMessage>.Run(() => { return this.RequestAction(entityName, string.Empty, true); });
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Get(string entityName, string methodName)
        {
            return await Task<HttpResponseMessage>.Run(() => { return this.RequestAction(entityName, methodName, true); });
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
            Func<string, string, Type> getClassType = (classNamespace, className) =>
            {
                return Activator.CreateInstance(classNamespace, string.Format("{0}.{1}", classNamespace, className)).Unwrap().GetType();
            };

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(new OpenDataAccess.Service.RequestHandler().ProcessRequest(Code.Request.GetRequest(this, blGet), getClassType, entityName, methodName), Encoding.UTF8, "application/json")
            };
        }
    }
}