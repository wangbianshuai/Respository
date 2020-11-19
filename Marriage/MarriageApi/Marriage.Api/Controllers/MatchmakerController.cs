using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.Matchmaker;
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

        /// <summary>
        /// 以微信OpenId获取红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMatchmakerByOpenIdResponse> GetMatchmakerByOpenId(GetMatchmakerByOpenIdRequest request)
        {
            return await Task.Run(() => _Matchmaker.GetMatchmakerByOpenId(request));
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<MatchmakerRegisterResponse> Register(MatchmakerRegisterRequest request)
        {
            return await Task.Run(() => _Matchmaker.Register(request));
        }

        /// <summary>
        /// 获取红娘信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMatchmakerInfoResponse> GetMatchmakerInfo(GetMatchmakerInfoRequest request)
        {
            return await Task.Run(() => _Matchmaker.GetMatchmakerInfo(request));
        }

        /// <summary>
        /// 获取红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMatchmakerResponse> GetMatchmaker(GetMatchmakerRequest request)
        {
            return await Task.Run(() => _Matchmaker.GetMatchmaker(request));
        }

        /// <summary>
        /// 更新红娘基本信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<UpdateMatchmakerInfoResponse> UpdateMatchmakerInfo(UpdateMatchmakerInfoRequest request)
        {
            return await Task.Run(() => _Matchmaker.UpdateMatchmakerInfo(request));
        }

        /// <summary>
        /// 获取平台红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetAppMatchmakerResponse> GetAppMatchmaker(GetAppMatchmakerRequest request)
        {
            return await Task.Run(() => _Matchmaker.GetAppMatchmaker(request));
        }
    }
}
