using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenDataAccessCore.Utility;

namespace AbetAccount.Admin.Web.Controllers
{
    [Produces("application/json")]
    [Consumes("application/json", "multipart/form-data")]
    [Route("UploadHandler.ashx")]
    public class UploadController : Controller
    {
        readonly IWebHostEnvironment _WebHostEnvironment;

        public UploadController(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public async Task<JsonResult> Post()
        {
            return await Task.Run(() => Upload());
        }

        private JsonResult GetMessage(string message)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("Message", message);
            dict.Add("IsSuccess", false);
            return this.Json(dict);
        }

        JsonResult Upload()
        {
            try
            {
                var files = this.Request.Form.Files;
                string fileType = Code.Request.GetParameterValue(this.Request, "ft");
                string fileName = string.Empty;
                string filePath = Code.Request.GetParameterValue(this.Request, "fp");
                string fileSize = string.Empty;

                if (files.Count > 0)
                {
                    if (string.IsNullOrEmpty(fileType)) fileType = "html";

                    fileSize = Common.GetFileSize(Convert.ToInt32(files[0].Length));

                    if (string.IsNullOrEmpty(filePath))
                    {
                        string ext = Path.GetExtension(files[0].FileName);
                        filePath = string.Format("resouces/{0}/", fileType);
                        fileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + new Random().Next(100000, 999999) + ext;
                    }
                    else
                    {
                        fileName = Path.GetFileName(filePath);
                        filePath = filePath.Replace(fileName, string.Empty);
                    }

                    string path = _WebHostEnvironment.WebRootPath + "\\" + filePath.Replace("/", "\\");
                    filePath += fileName;

                    if (!Directory.Exists(path)) Directory.CreateDirectory(path);

                    path += fileName;

                    MemoryStream ms = new MemoryStream();
                    files[0].CopyTo(ms);

                    Common.SaveFile(ms.ToArray(), path);

                    return this.Json(new { IsSuccess = true, FileName = fileName, FileSize = fileSize, FilePath = filePath });
                }
                else return this.GetMessage("未有上传文件！");
            }
            catch (Exception ex)
            {
                return this.GetMessage("上传失败，" + Common.GetInnerException(ex).Message);
            }
        }
    }
}