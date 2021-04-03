using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AbetAccount.Api.Code;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using OpenDataAccessCore.Utility;

namespace AbetAccount.Api.Controllers
{
    [Route("api/formData")]
    [ApiController]
    public class FormDataProxyController : ControllerBase
    {
        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="act"></param>
        /// <param name="param"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ContentResult> Post([FromForm] string act, [FromForm] string param, [FromForm] string url)
        {
            return await Task.Run(() =>
            {
                try
                {
                    HttpClient client = new HttpClient();

                    var formdata = new MultipartFormDataContent();
                    formdata.Add(new StringContent(act), "act");
                    formdata.Add(new StringContent(param), "param");

                    return Content(client.PostAsync(url, formdata).Result.Content.ReadAsStringAsync().Result);
                }
                catch(Exception ex)
                {
                    ex = Common.GetInnerException(ex);
                    return Content(Common.ToJson(new { Exception = ex.Message }));
                }
            });
        }
    }
}
