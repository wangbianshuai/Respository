using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.Live;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using OpenDataAccessCore.Utility;

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 直播
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("直播")]
    public class LiveController : ControllerBase
    {
        public Application.ILive _Live { get; set; }

        /// <summary>
        /// 创建直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<CreateLiveResponse> CreateLive(CreateLiveRequest request)
        {
            return await Task.Run(() => _Live.CreateLive(request));
        }

        /// <summary>
        /// 更新直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<UpdateLiveResponse> UpdateLive(UpdateLiveRequest request)
        {
            return await Task.Run(() => _Live.UpdateLive(request));
        }

        /// <summary>
        /// 删除直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<DeleteLiveResponse> DeleteLive(DeleteLiveRequest request)
        {
            return await Task.Run(() => _Live.DeleteLive(request));
        }

        /// <summary>
        /// 以客户ID查询直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<QueryLiveByCustomerResponse> QueryLiveByCustomer(QueryLiveByCustomerRequest request)
        {
            return await Task.Run(() => _Live.QueryLiveByCustomer(request));
        }

        /// <summary>
        /// 查询直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<GetLiveDataResponse> GetLiveData(GetLiveDataRequest request)
        {
            return await Task.Run(() => _Live.GetLiveData(request));
        }

        /// <summary>
        /// 同步播放流数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<SyncPlayStreamDataResponse> SyncPlayStreamData(SyncPlayStreamDataRequest request)
        {
            return await Task.Run(() => _Live.SyncPlayStreamData(request));
        }
    }
}
