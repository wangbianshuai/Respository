using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Marriage.Utility;
using Marriage.Web.Code;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Marriage.Web.Controllers
{
    [Route("api")]
    [ApiController]
    [ApiExceptionFilter]
    [TokenFilter]
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
        [ApiTokenParameter]
        public async Task<ContentResult> Get(string entityName, string loginUserId, string sign, string appId)
        {
            return await Get(entityName, string.Empty, loginUserId, sign, appId);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        [HttpGet("{entityName}/{methodName}")]
        [ApiTokenParameter]
        public async Task<ContentResult> Get(string entityName, string methodName, string loginUserId, string sign, string appId)
        {
            return await Invoke("GET", entityName, methodName, loginUserId, sign, appId);
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        [HttpPut("{entityName}")]
        [ApiTokenParameter]
        public async Task<ContentResult> Put(string entityName, string loginUserId, string sign, string appId)
        {
            return await Put(entityName, string.Empty, loginUserId, sign, appId);
        }

        /// <summary>
        /// PUT请求
        /// </summary>
        /// <returns></returns>
        [HttpPut("{entityName}/{methodName}")]
        [ApiTokenParameter]
        public async Task<ContentResult> Put(string entityName, string methodName, string loginUserId, string sign, string appId)
        {
            return await Invoke("PUT", entityName, methodName, loginUserId, sign, appId);
        }

        /// <summary>
        /// DELETE请求
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{entityName}")]
        [ApiTokenParameter]
        public async Task<ContentResult> Delete(string entityName, string loginUserId, string sign, string appId)
        {
            return await Delete(entityName, string.Empty, loginUserId, sign, appId);
        }

        /// <summary>
        /// DELETE请求
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{entityName}/{methodName}")]
        [ApiTokenParameter]
        public async Task<ContentResult> Delete(string entityName, string methodName, string loginUserId, string sign, string appId)
        {
            return await Invoke("DELETE", entityName, methodName, loginUserId, sign, appId);
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        [HttpPost("{entityName}")]
        [ApiTokenParameter]
        public async Task<ContentResult> Post(string entityName, string loginUserId, string sign, string appId)
        {
            return await Post(entityName, string.Empty, loginUserId, sign, appId);
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        [HttpPost("{entityName}/{methodName}")]
        [ApiTokenParameter]
        public async Task<ContentResult> Post(string entityName, string methodName, string loginUserId, string sign, string appId)
        {
            return await Invoke("POST", entityName, methodName, loginUserId, sign, appId);
        }

        public async Task<ContentResult> Invoke(string requestType, string entityName, string methodName, string loginUserId, string sign, string appId)
        {
            return await Task<ContentResult>.Run(() => { return this.RequestAction(requestType, entityName, methodName, loginUserId, sign, appId); });
        }

        /// <summary>
        /// 请求行为
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="methodName"></param>
        /// <returns></returns>
        ContentResult RequestAction(string requestType, string entityName, string methodName, string loginUserId, string sign, string appId)
        {
           var request = Code.Request.GetRequest(this, requestType, entityName, methodName, loginUserId, _WebHostEnvironment, sign, appId);
            string content = new OpenDataAccessCore.Service.RequestHandler().ProcessRequest(request, entityName, methodName);

            this.Response.Cookies.Append("token", request.Token);

            if (string.IsNullOrEmpty(content)) content = Common.ToJson(new { Message = "请求失败！" });
            return this.Content(content, "application/json");
        }
    }
}
