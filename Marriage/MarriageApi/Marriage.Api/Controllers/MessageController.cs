using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.Message;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 消息
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [Description("消息")]
    public class MessageController : ControllerBase
    {
        public Application.IMessage _Message { get; set; }

        /// <summary>
        /// 同步微信消息模板
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<SyncWeChatTemplateResponse> SyncWeChatTemplate(SyncWeChatTemplateRequest request)
        {
            return await Task.Run(() => _Message.SyncWeChatTemplate(request, Code.Request.GetHeadersValue(this.Request, "token")));
        }
    }
}
