using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageSquare;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲广场")]
    public class MarriageSquareController : ControllerBase
    {
        public Application.IMarriageSquare _MarriageSquare { get; set; }

        /// <summary>
        /// 查询相亲广场
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<QueryMarriageSquareResponse> QueryMarriageSquare(QueryMarriageSquareRequest request)
        {
            return await Task.Run(() => _MarriageSquare.QueryMarriageSquare(request));
        }

        /// <summary>
        /// 更新相亲广场玫瑰数
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<UpdateMarriageSquareRoseCountResponse> UpdateMarriageSquareRoseCount(UpdateMarriageSquareRoseCountRequest request)
        {
            return await Task.Run(() => _MarriageSquare.UpdateMarriageSquareRoseCount(request));
        }
    }
}
