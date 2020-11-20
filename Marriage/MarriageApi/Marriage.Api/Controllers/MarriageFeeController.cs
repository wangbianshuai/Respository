using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageFee;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲费用
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲费用")]
    public class MarriageFeeController : ControllerBase
    {
        public Application.IMarriageFee _MarriageFee { get; set; }

        /// <summary>
        /// 获取相亲费用
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageFeeResponse> GetMarriageFee(GetMarriageFeeRequest request)
        {
            return await Task.Run(() => _MarriageFee.GetMarriageFee(request));
        }

        /// <summary>
        /// 保存相亲费用
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<SaveMarriageFeeResponse> SaveMarriageFee(SaveMarriageFeeRequest request)
        {
            return await Task.Run(() => _MarriageFee.SaveMarriageFee(request));
        }
    }
}
