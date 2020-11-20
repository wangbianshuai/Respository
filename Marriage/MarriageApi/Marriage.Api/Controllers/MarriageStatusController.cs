using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageStatus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲状态
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲状态")]
    public class MarriageStatusController : ControllerBase
    {
        public Application.IMarriageStatus _MarriageStatus { get; set; }

        /// <summary>
        /// 获取相亲状态
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageStatusResponse> GetMarriageStatus(GetMarriageStatusRequest request)
        {
            return await Task.Run(() => _MarriageStatus.GetMarriageStatus(request));
        }

        /// <summary>
        /// 保存相亲状态
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<SaveMarriageStatusResponse> SaveMarriageStatus(SaveMarriageStatusRequest request)
        {
            return await Task.Run(() => _MarriageStatus.SaveMarriageStatus(request));
        }
    }
}
