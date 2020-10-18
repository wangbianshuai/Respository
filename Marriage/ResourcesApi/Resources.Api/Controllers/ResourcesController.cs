using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using Resources.Api.Code;
using Resources.Entity.Application.File;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using OpenDataAccessCore.Utility;

namespace Resources.Api.Controllers
{
    /// <summary>
    /// 资源
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("资源")]
    public class ResourcesController : ControllerBase
    {
        readonly IWebHostEnvironment _WebHostEnvironment;

        public Application.IFile _File { get; set; }

        public ResourcesController(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// 查询文件
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<GetFileResponse> GetFile(GetFileRequest request)
        {
            return await Task.Run(() => _File.GetFile(request, Code.Request.GetHttpHost(this.Request)));
        }

        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<DeleteFileResponse> DeleteFile(DeleteFileRequest request)
        {
            return await Task.Run(() => _File.DeleteFile(request, _WebHostEnvironment.WebRootPath));
        }
    }
}
