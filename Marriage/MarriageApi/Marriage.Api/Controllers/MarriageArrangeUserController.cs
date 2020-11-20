using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageArrangeUser;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲安排用户
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲安排用户")]
    public class MarriageArrangeUserController : ControllerBase
    {
        public Application.IMarriageArrangeUser _MarriageArrangeUser { get; set; }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeUserByMatchmakerResponse> GetUserByMatchmaker(GetMarriageArrangeUserByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageArrangeUser.GetUserByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下用户条件类型
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeUserConditionTypeByMatchmakerResponse> GetUserConditionTypeByMatchmaker(GetMarriageArrangeUserConditionTypeByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageArrangeUser.GetUserConditionTypeByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下用户条件类型列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeUserConditionTypesByMatchmakerResponse> GetUserConditionTypesByMatchmaker(GetMarriageArrangeUserConditionTypesByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageArrangeUser.GetUserConditionTypesByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeUserInfoByMatchmakerResponse> GetUserInfoByMatchmaker(GetMarriageArrangeUserInfoByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageArrangeUser.GetUserInfoByMatchmaker(request));
        }
    }
}
