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

namespace AbetOrder.Web.Controllers
{
    public class PdfController : ApiController
    {
        public async Task<HttpResponseMessage> Get(string name)
        {
            return await Task<HttpResponseMessage>.Run(() => { return GetPdf(name); });
        }

        private HttpResponseMessage GetPdf(string name)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

            try
            {
                string html = string.Empty;

                string css = string.Empty;

                using (TextReader reader = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + "\\templates\\Order1.html"))
                {
                    html = reader.ReadToEnd();
                }

                using (TextReader reader = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + "\\css\\Order1.css"))
                {
                    css = reader.ReadToEnd();
                }

                var bs = OpenDataAccess.Utility.PdfDocument.CreatePdfFromHtml(html, css);

                response.Content = new ByteArrayContent(bs);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            }
            catch (Exception ex)
            {
                response.Content = new StringContent(ex.Message, Encoding.UTF8, "text/html");
            }

            return response;
        }
    }
}