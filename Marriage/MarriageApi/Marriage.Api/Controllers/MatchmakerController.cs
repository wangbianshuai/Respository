using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.Matchmaker;
using Marriage.Entity.Application.WxUser;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 红娘
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("红娘")]
    public class MatchmakerController : ControllerBase
    {
        public Application.IMatchmaker _Matchmaker { get; set; }

        /// <summary>
        /// 获取用户红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserMatchmakerResponse> GetUserMatchmaker(GetUserMatchmakerRequest request)
        {
            return await Task.Run(() => _Matchmaker.GetUserMatchmaker(request));
        }
    }
}
