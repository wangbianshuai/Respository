using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace AbetOrder.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务

            // Web API 路由
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
             name: "DefaultApi2",
             routeTemplate: "api/{entityname}/{methodname}",
             defaults: new { controller = "Default" }
           );

            config.Routes.MapHttpRoute(
             name: "DefaultApi",
             routeTemplate: "api/{entityname}",
             defaults: new { controller = "Default" }
            );

            config.Routes.MapHttpRoute(
             name: "DefaultApi3",
             routeTemplate: "pdf/{name}.pdf",
             defaults: new { controller = "Pdf" }
           );
        }
    }
}
