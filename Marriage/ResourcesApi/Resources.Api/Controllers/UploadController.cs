using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Resources.Api.Code;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace Resources.Api.Controllers
{
    /// <summary>
    /// 上传
    /// </summary>
    [Produces("application/json")]
    [Consumes("application/json", "multipart/form-data")]
    [Route("api/[controller]")]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("上传")]
    public class UploadController : ControllerBase
    {
        readonly IWebHostEnvironment _WebHostEnvironment;

        public Application.IFile _File { get; set; }

        public UploadController(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiParameter(Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string")]
        public async Task<Entity.Application.File.UploadFileResponse> Post(string appId)
        {
            return await Task.Run(() => 
            { 
                try
                {
                    return _File.UploadFile(GetUploadFileRequest(appId));
                }
                catch (Exception ex)
                {
                    return new Entity.Application.File.UploadFileResponse()
                    {
                        Ack = new Entity.Application.Ack()
                        {
                            Code = -1,
                            IsSuccess = false,
                            Message = ex.Message
                        }
                    };
                }
            });
        }

        Entity.Application.File.UploadFileRequest GetUploadFileRequest(string appId)
        {
            Entity.Application.File.UploadFileRequest request = new Entity.Application.File.UploadFileRequest();

            request.IpAddress = Code.Request.GetClientIp(this.Request);
            request.AppId = appId;

            request.WebRootPath = _WebHostEnvironment.WebRootPath;
            request.HttpHost = Code.Request.GetHttpHost(this.Request);

            var files = this.Request.Form.Files;

            if (files.Count > 0)
            {
                var file = files[0];

                request.FileSize = file.Length;
                request.FileExt = Path.GetExtension(file.FileName);
                request.FileName = file.FileName;
                request.FileType = GetFileType(request.FileExt.Replace(".", string.Empty));

                MemoryStream ms = new MemoryStream();
                files[0].CopyTo(ms);

                request.Stream = ms.ToArray();
            }

            return request;
        }

        string GetFileType(string fileType)
        {
            string t = fileType.ToLower();

            string imageType = "bmp,jpg,jpeg,png,gif,svg,webp";
            if (imageType.Contains(t)) return "images";

            string textType = "txt,json";

            if (textType.Contains(t)) return "text";

            if (t == "xls" || t == "xlsx") return "excel";

            if (t == "doc" || t == "docx") return "word";

            if (t == "ppt" || t == "pptx") return "ppt";

            if (t == "rar" || t == "zip") return "zip";

            if (t == "pdf") return "pdf";

            throw new Exception(string.Format("对不起，目前不支持此类型{0}文件上传", fileType));
        }
    }
}
