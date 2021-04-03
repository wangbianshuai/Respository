using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AbetAccount.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [Description("默认")]
    public class DefaultController : ControllerBase
    {
        /// <summary>
        /// 获取当前时间
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<Entity.Application.GetCurrentTimeResponse> GetCurrentTime()
        {
            return await Task.Run(() =>
            {
                return new Entity.Application.GetCurrentTimeResponse() { Time = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds };
            });
        }
    }
}
