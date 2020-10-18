using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Marriage.Utility;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Marriage.Web.Controllers
{
    [Route("api")]
    [ApiController]
    public class IndexController : ControllerBase
    {
        readonly IWebHostEnvironment _WebHostEnvironment;

        public IndexController(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// OPTIONS请求
        /// </summary>
        /// <returns></returns>
        [HttpOptions]
        public ContentResult Options()
        {
            return this.Content(null);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        [HttpGet("{entityName}")]
        public async Task<ContentResult> Get(string entityName)
        {
            return await Get(entityName, string.Empty);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        [HttpGet("{entityName}/{methodName}")]
        public async Task<ContentResult> Get(string entityName, string methodName)
        {
            return await Invoke("GET", entityName, methodName);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        [HttpPut("{entityName}")]
        public async Task<ContentResult> Put(string entityName)
        {
            return await Put(entityName, string.Empty);
        }

        /// <summary>
        /// PUT请求
        /// </summary>
        /// <returns></returns>
        [HttpPut("{entityName}/{methodName}")]
        public async Task<ContentResult> Put(string entityName, string methodName)
        {
            return await Invoke("PUT", entityName, methodName);
        }

        /// <summary>
        /// DELETE请求
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{entityName}")]
        public async Task<ContentResult> Delete(string entityName)
        {
            return await Delete(entityName, string.Empty);
        }

        /// <summary>
        /// DELETE请求
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{entityName}/{methodName}")]
        public async Task<ContentResult> Delete(string entityName, string methodName)
        {
            return await Invoke("DELETE", entityName, methodName);
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        [HttpPost("{entityName}")]
        public async Task<ContentResult> Post(string entityName)
        {
            return await Post(entityName, string.Empty);
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        [HttpPost("{entityName}/{methodName}")]
        public async Task<ContentResult> Post(string entityName, string methodName)
        {
            return await Invoke("POST", entityName, methodName);
        }

        public async Task<ContentResult> Invoke(string requestType, string entityName, string methodName)
        {
            return await Task<ContentResult>.Run(() => { return this.RequestAction(requestType, entityName, methodName); });
        }

        /// <summary>
        /// 请求行为
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        ContentResult RequestAction(string requestType, string entityName, string methodName)
        {
            string content = string.Empty;
            string adminUserId = string.Empty;
            Guid appAccountId = Guid.Empty;

#if DEBUG
            Code.Cache.AddAppAccountInfo("admin", new Entity.AppAcountInfo() { AppAccountId = new Guid("04b82043-da37-4133-bfc5-031ed76760a6"), SiteTitle = "A2China" });
#endif
            try
            {
                appAccountId = Code.Request.GetAppAccountId(this.Request);
                adminUserId = OpenDataAccessCore.Service.UserToken.ParseToken(Code.Request.GetHeadersValue(this.Request, "token"), appAccountId);
            }
            catch (Exception ex)
            {
                content = Common.ToJson(new { IsReLogin = true, Exception = ex.Message });
                adminUserId = null;
            }

            if (adminUserId != null) content = new OpenDataAccessCore.Service.RequestHandler().ProcessRequest(Code.Request.GetRequest(this, requestType, entityName, methodName, adminUserId, appAccountId, _WebHostEnvironment), entityName, methodName);

            if (string.IsNullOrEmpty(content)) content = Common.ToJson(new { Message = "请求失败！" });
            return this.Content(content, "application/json");
        }
    }
}
