using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AbetAccount.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AbetAccount.Api.Controllers
{
    [Route("api/image")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        [HttpGet]
        public async Task<FileContentResult> Get(string url)
        {
            return await Task<FileContentResult>.Run(() => { return GetImage(url); });
        }

        private FileContentResult GetImage(string url)
        {
            try
            {
                return new FileContentResult(Common.GetImageBytes(url), "image/*");
            }
            catch
            {

            }

            return null;
        }
    }
}
