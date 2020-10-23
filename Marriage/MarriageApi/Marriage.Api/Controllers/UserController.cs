using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.File;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 用户
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [Description("用户")]
    public class UserController : ControllerBase
    {
        public Application.IFile _User { get; set; }

        /// <summary>
        /// 同步微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<GetFileResponse> SyncWeChatUser(GetFileRequest request)
        {
            return await Task.Run(() => _User.GetFile(request, Code.Request.GetHeadersValue(this.Request, "token")));
        }
    }
}
