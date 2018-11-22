using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace WindowsFramework.Utility
{
    public class AppSetting
    {
        /// <summary>
        /// ApiServiceUrl
        /// </summary>
        public static string ApiServiceUrl { get { return ConfigurationManager.AppSettings["ApiServiceUrl"]; } }

        public static bool IsDebug { get { return ConfigurationManager.AppSettings["IsDebug"] == "true"; } }

        public static string WebApiUrl { get { return ConfigurationManager.AppSettings["WebApiUrl"]; } }

    }
}
