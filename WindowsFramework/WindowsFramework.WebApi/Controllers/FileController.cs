using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace WindowsFramework.WebApi.Controllers
{
    public class FileController : ApiController
    {
        public async Task<HttpResponseMessage> Get(string name)
        {
            return await Task<HttpResponseMessage>.Run(() => { return GetFile(name); });
        }

        private HttpResponseMessage GetFile(string name)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

            try
            {
                string dirPath = AppDomain.CurrentDomain.BaseDirectory.Replace("WindowsFramework.WebApi\\", "") + "WindowsFramework.Component\\";

                if (name.Equals("bin")) dirPath += "bin\\debug";
                else if (name.Equals("configs")) dirPath += "configs";
                else if (name.Equals("images")) dirPath += "images";

                string path = string.Concat(AppDomain.CurrentDomain.BaseDirectory, string.Format("{0}_{1}", name, Guid.NewGuid().ToString().Substring(0, 8)));
                Utility.Common.Compress(dirPath, path);

                FileStream fs = new FileStream(path, FileMode.Open);

                response.Content = new StreamContent(fs);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-zip-compressed");
            }
            catch (Exception ex)
            {
                var message = new
                {
                    Title = "Read.Exception",
                    Url = this.Request.RequestUri.AbsoluteUri.ToString()
                };

                response.Content = new StringContent(ex.Message, Encoding.UTF8, "text/html");
            }

            return response;
        }
    }
}