using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageUser;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲用户
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲用户")]
    public class MarriageUserController : ControllerBase
    {
        public Application.IMarriageUser _MarriageUser { get; set; }

        /// <summary>
        /// 以微信OpenId获取用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserByOpenIdResponse> GetUserByOpenId(GetUserByOpenIdRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserByOpenId(request));
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<RegisterResponse> Register(RegisterRequest request)
        {
            return await Task.Run(() => _MarriageUser.Register(request));
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserInfoResponse> GetUserInfo(GetUserInfoRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserInfo(request));
        }

        /// <summary>
        /// 获取用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserResponse> GetUser(GetUserRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUser(request));
        }

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserConditionTypesResponse> GetUserConditionTypes(GetUserConditionTypesRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserConditionTypes(request));
        }

        /// <summary>
        /// 更新用户基本信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<UpdateUserInfoResponse> UpdateUserInfo(UpdateUserInfoRequest request)
        {
            return await Task.Run(() => _MarriageUser.UpdateUserInfo(request));
        }

        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserConditionTypeResponse> GetUserConditionType(GetUserConditionTypeRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserConditionType(request));
        }
    }
}
