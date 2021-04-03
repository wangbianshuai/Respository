using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Text;

namespace AbetAccount.Admin.Web.Controllers
{
    [Route("")]
    public class HtmlController : Controller
    {
        readonly IWebHostEnvironment _WebHostEnvironment;

        public HtmlController(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }

        [HttpGet("{name}.html")]
        public void Get(string name)
        {
            Get(name, string.Empty);
        }

        [HttpGet("{name}/{name2}.html")]
        public void Get(string name, string name2)
        {
            this.Response.ContentType = "text/html;charset=utf-8";

            try
            {
                if (name.ToLower().Equals("operationlog")) GetOperationLog();
                else GetHtml(name, name2);
            }
            catch (Exception ex)
            {
                this.Response.WriteAsync(ex.Message);
            }
        }

        void GetOperationLog()
        {
            string path = Code.Request.GetParameterValue(this.Request, "Path");

            path = _WebHostEnvironment.WebRootPath + "\\" + path;

            if (System.IO.File.Exists(path))
            {
                using (TextReader reader = new StreamReader(path))
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendLine("<html>");
                    sb.AppendLine("<head>");
                    sb.AppendLine("<title>操作日志</title>");
                    sb.AppendLine("</head>");
                    sb.AppendLine("<body>");
                    string content = reader.ReadToEnd();
                    content = content.Replace("\n", "</br>");
                    sb.AppendLine("<div>");
                    sb.AppendLine(content);
                    sb.AppendLine("</div>");
                    sb.AppendLine("</body>");
                    sb.AppendLine("</html>");
                    this.Response.WriteAsync(sb.ToString());
                }
            }
            else
            {
                this.Response.WriteAsync("文本不存在！");
            }
        }

        private void GetHtml(string name, string name2)
        {
            string cacheName =  name + name2;
            object obj = Code.Cache.GetCache(cacheName);
            if (obj != null) { this.Response.WriteAsync((string)obj); return; }

            string html = string.Empty;

            string path = _WebHostEnvironment.WebRootPath + string.Format("\\{0}{1}.html", name, string.IsNullOrEmpty(name2) ? string.Empty : "\\"+ name2);

            using (TextReader reader = new StreamReader(path))
            {
                html = reader.ReadToEnd();
            }

            html = html.Replace("${PageVersion}", Code.Cache.PageVersion);

            Code.Cache.AddCache(cacheName, html);

            this.Response.WriteAsync(html);
        }
    }
}