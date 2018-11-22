using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace WindowsFramework.WebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务

            // Web API 路由
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(name: "FileApi", routeTemplate: "res/{name}", defaults: new { controller = "File" });

            config.Routes.MapHttpRoute(name: "DefaultApi", routeTemplate: "api/{classname}/{methodname}", defaults: new { controller = "Default" });
        }
    }
}
