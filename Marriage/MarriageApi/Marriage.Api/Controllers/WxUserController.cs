using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.WxUser;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 微信用户
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("微信用户")]
    public class WxUserController : ControllerBase
    {
        public Application.IWxUser _WxUser { get; set; }

        /// <summary>
        /// 获取微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetWxUserResponse> GetWxUser(GetWxUserRequest request)
        {
            return await Task.Run(() => _WxUser.GetWxUser(request));
        }

        /// <summary>
        /// 通过微信小程序获取微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<GetOpenIdByCodeResponse> GetOpenIdByCode(GetOpenIdByCodeRequest request)
        {
            return await Task.Run(() => _WxUser.GetOpenIdByCode(request));
        }

        /// <summary>
        /// 微信用户授权登录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<AuthLoginResponse> AuthLogin(AuthLoginRequest request)
        {
            return await Task.Run(() => _WxUser.AuthLogin(request));
        }
    }
}
