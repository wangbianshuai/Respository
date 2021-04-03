using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AbetAccount.Admin.Web.Controllers
{
    [Route("configs/getconfig")]
    [ApiController]
    public class GetConfigController : Controller
    {
        readonly IWebHostEnvironment _WebHostEnvironment;

        public GetConfigController(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public void Get(string name)
        {
            this.Response.ContentType = "application/json;charset=utf-8";

            try
            {
                GetConfig(name);
            }
            catch (Exception ex)
            {
                this.Response.WriteAsync(ex.Message);
            }
        }

        private void GetConfig(string name)
        {
            object obj = Code.Cache.GetCache(name);
            if (obj != null) { this.Response.WriteAsync((string)obj); return; }

            string json = string.Empty;

            string path = _WebHostEnvironment.WebRootPath + string.Format("\\configs\\{0}.json", name.Replace("_", "\\"));

            using (TextReader reader = new StreamReader(path))
            {
                json = reader.ReadToEnd();
            }

            Code.Cache.AddCache(name, json);

            this.Response.WriteAsync(json);
        }
    }
}
