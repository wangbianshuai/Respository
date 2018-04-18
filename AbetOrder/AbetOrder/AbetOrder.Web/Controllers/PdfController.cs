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

                string htmlName = name == "order" ? "Order1.html" : "ProcessOrder1.html";
                string cssName = name == "order" ? "Order1.css" : "ProcessOrder1.css";

                using (TextReader reader = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + "\\templates\\" + htmlName))
                {
                    html = reader.ReadToEnd();
                }

                OpenDataAccess.Entity.IEntityData order = new OpenDataAccess.Entity.EntityData("Order");
                order.SetValue("OrderId", "061135d5-021f-4c1e-b07c-511fd3a73f5f");

                html = new Component.TemplateResolve().ResolveContent(html, order);

                using (TextReader reader = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + "\\css\\" + cssName))
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