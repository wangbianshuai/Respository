using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AbetAccount.Admin.Web.Controllers
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
        public async Task<Dictionary<string, object>> GetCurrentTime()
        {
            return await Task.Run(() =>
            {
                Dictionary<string, object> dict = new Dictionary<string, object>();
                dict.Add("Time", (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds);
                return dict;
            });
        }
    }
}
