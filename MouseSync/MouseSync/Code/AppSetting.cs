using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace MouseSync.Code
{
    public class AppSetting
    {
        public static int UdpServicePort { get { int port = 0; int.TryParse(ConfigurationManager.AppSettings["UdpServicePort"], out port); return port; } }
    }
}
