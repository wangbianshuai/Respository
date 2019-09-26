using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace PurchaseSale.Web.Controllers
{
    public class DefaultController : ApiController
    {
        /// <summary>
        /// OPTIONS请求
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Options()
        {
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Get(string entityName)
        {
            return await Get(entityName, string.Empty);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Get(string entityName, string methodName)
        {
            return await Post(entityName, methodName);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Put(string entityName)
        {
            return await Put(entityName, string.Empty);
        }

        /// <summary>
        /// PUT请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Put(string entityName, string methodName)
        {
            return await Post(entityName, methodName);
        }

        /// <summary>
        /// DELETE请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Delete(string entityName)
        {
            return await Delete(entityName, string.Empty);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Delete(string entityName, string methodName)
        {
            return await Post(entityName, methodName);
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Post(string entityName)
        {
            return await Post(entityName, string.Empty);
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> Post(string entityName, string methodName)
        {
            return await Task<HttpResponseMessage>.Run(() => { return this.RequestAction(entityName, methodName); });
        }

        /// <summary>
        /// 请求行为
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        HttpResponseMessage RequestAction(string entityName, string methodName)
        {
            //if (!JudgeRight()) return new HttpResponseMessage(HttpStatusCode.InternalServerError);

            Func<string, string, Type> getClassType = (classNamespace, className) =>
            {
                return Activator.CreateInstance(classNamespace, string.Format("{0}.{1}", classNamespace, className)).Unwrap().GetType();
            };

            string content = string.Empty;
            string userId = string.Empty;

            try
            {
                userId = OpenDataAccess.Service.UserToken.ParseToken(Code.Request.GetHeadersValue(this.Request, "token"));
            }
            catch (Exception ex)
            {
                content = OpenDataAccess.Utility.Common.ToJson(new { IsReLogin = true, Exception = ex.Message });
                userId = null;
            }

            if (userId != null) content = new OpenDataAccess.Service.RequestHandler().ProcessRequest(Code.Request.GetRequest(this, entityName, methodName, userId), getClassType, entityName, methodName);

            return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(content, Encoding.UTF8, "application/json") };
        }

        bool JudgeRight()
        {
            if (this.Request.Headers.Referrer == null) return false;

            if (this.Request.Headers.Referrer.Host != this.Request.RequestUri.Host) return false;

            string localPath = this.Request.Headers.Referrer.LocalPath.ToLower();
            if (localPath != "/" && !localPath.Contains("default.aspx") && !localPath.Contains("order.aspx") && !localPath.Contains("h5.aspx")) return false;

            return true;
        }
    }
}