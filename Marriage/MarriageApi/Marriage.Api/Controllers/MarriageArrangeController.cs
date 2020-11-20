using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageArrange;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲安排")]
    public class MarriageArrangeController : ControllerBase
    {
        public Application.IMarriageArrange _MarriageArrange { get; set; }

        /// <summary>
        /// 查询相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<QueryMarriageArrangeResponse> QueryMarriageArrange(QueryMarriageArrangeRequest request)
        {
            return await Task.Run(() => _MarriageArrange.QueryMarriageArrange(request));
        }

        /// <summary>
        /// 以用户获取相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeByUserResponse> GetMarriageArrangeByUser(GetMarriageArrangeByUserRequest request)
        {
            return await Task.Run(() => _MarriageArrange.GetMarriageArrangeByUser(request));
        }

        /// <summary>
        /// 查询红娘下相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<QueryMarriageArrangeByMatchmakerResponse> QueryMarriageArrangeByMatchmaker(QueryMarriageArrangeByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageArrange.QueryMarriageArrangeByMatchmaker(request));
        }

        /// <summary>
        /// 获取红娘下相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeByMatchmakerResponse> GetMarriageArrangeByMatchmaker(GetMarriageArrangeByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageArrange.GetMarriageArrangeByMatchmaker(request));
        }

        /// <summary>
        /// 获取相亲安排信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeByIdResponse> GetMarriageArrangeById(GetMarriageArrangeByIdRequest request)
        {
            return await Task.Run(() => _MarriageArrange.GetMarriageArrangeById(request));
        }

        /// <summary>
        /// 更新相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<UpdateMarriageArrangeResponse> UpdateMarriageArrange(UpdateMarriageArrangeRequest request)
        {
            return await Task.Run(() => _MarriageArrange.UpdateMarriageArrange(request));
        }
    }
}
