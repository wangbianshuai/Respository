using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;

namespace OpenDataFramework.WebApi.Controllers
{
    public class JsController : ApiController
    {
        /// <summary>
        /// GET请求
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Get(string name)
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(new Code.DataAccess(Code.Request.GetRequest(this)).GetJs(name), Encoding.UTF8, "text/javascript")
            };
        }

        public HttpResponseMessage Get(string name, string s)
        {
            if (!s.Equals("true")) return null;
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(new Code.DataAccess(Code.Request.GetRequest(this)).GetSource(name, "js"), Encoding.UTF8, "text/javascript")
            };
        }
    }
}