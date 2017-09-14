using OpenDataFramework.Component;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace OpenDataFramework.WebApi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            try
            {
                RequestEntityType.VesionId = string.Format("V{0}", Guid.NewGuid().ToString().Substring(0, 8).ToUpper());
            }
            catch
            {

            }
        }
    }
}
