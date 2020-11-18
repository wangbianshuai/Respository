using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageUser;
using Marriage.Entity.Application.MarriageUser2;
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

        public Application.IMarriageUser2 _MarriageUser2 { get; set; }

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

        /// <summary>
        /// 保存用户条件类型
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<SaveUserConditionTypeResponse> SaveUserConditionType(SaveUserConditionTypeRequest request)
        {
            return await Task.Run(() => _MarriageUser.SaveUserConditionType(request));
        }

        /// <summary>
        /// 查询红娘下相亲人员列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<QueryUsersByMatchmakerResponse> QueryUsersByMatchmaker(QueryUsersByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageUser.QueryUsersByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserByMatchmakerResponse> GetUserByMatchmaker(GetUserByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下用户条件类型
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserConditionTypeByMatchmakerResponse> GetUserConditionTypeByMatchmaker(GetUserConditionTypeByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserConditionTypeByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下用户条件类型列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserConditionTypesByMatchmakerResponse> GetUserConditionTypesByMatchmaker(GetUserConditionTypesByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserConditionTypesByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserInfoByMatchmakerResponse> GetUserInfoByMatchmaker(GetUserInfoByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageUser.GetUserInfoByMatchmaker(request));
        }

        /// <summary>
        /// 更新红娘下用户状态
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<UpdateUserStatusByMatchmakerResponse> UpdateUserStatusByMatchmaker(UpdateUserStatusByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageUser.UpdateUserStatusByMatchmaker(request));
        }

        /// <summary>
        /// 获取用户下用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserByUserResponse> GetUserByUser(GetUserByUserRequest request)
        {
            return await Task.Run(() => _MarriageUser2.GetUserByUser(request));
        }

        /// <summary>
        /// 获取用户下用户条件类型
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserConditionTypeByUserResponse> GetUserConditionTypeByUser(GetUserConditionTypeByUserRequest request)
        {
            return await Task.Run(() => _MarriageUser2.GetUserConditionTypeByUser(request));
        }

        /// <summary>
        /// 获取用户下用户条件类型列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserConditionTypesByUserResponse> GetUserConditionTypesByUser(GetUserConditionTypesByUserRequest request)
        {
            return await Task.Run(() => _MarriageUser2.GetUserConditionTypesByUser(request));
        }

        /// <summary>
        /// 获取用户下用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserInfoByUserResponse> GetUserInfoByUser(GetUserInfoByUserRequest request)
        {
            return await Task.Run(() => _MarriageUser2.GetUserInfoByUser(request));
        }
    }
}
