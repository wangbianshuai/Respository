using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageMakePair;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲匹配")]
    public class MarriageMakePairController : ControllerBase
    {
        public Application.IMarriageMakePair _MarriageMakePair { get; set; }

        /// <summary>
        /// 计算相亲匹配
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<ComputeMarriageMakePairResponse> ComputeMarriageMakePair(ComputeMarriageMakePairRequest request)
        {
            return await Task.Run(() => _MarriageMakePair.ComputeMarriageMakePair(request));
        }
    }
}
