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
            return await Task<HttpResponseMessage>.Run(() => { return GetFile(); });
        }

        private HttpResponseMessage GetFile()
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

            try
            {
                string dirPath = AppDomain.CurrentDomain.BaseDirectory.Replace("WindowsFramework.WebApi\\", "") + "WindowsFramework.Component\\bin\\Debug";

                string path = string.Concat(AppDomain.CurrentDomain.BaseDirectory, "Component.zip");
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