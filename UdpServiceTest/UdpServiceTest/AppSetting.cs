using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UdpServiceTest
{
    public class AppSetting
    {
        /// <summary>
        /// ApiServiceUrl
        /// </summary>
        public static string ApiServiceUrl { get { return ConfigurationManager.AppSettings["ApiServiceUrl"]; } }

        public static string LocalId { get { return ConfigurationManager.AppSettings["LocalId"]; } }

        public static string WebApiUrl { get { return ConfigurationManager.AppSettings["WebApiUrl"]; } }

        public static string NginxAddress { get { return ConfigurationManager.AppSettings["NginxAddress"]; } }

        public static int UdpServicePort { get { int port = 0; int.TryParse(ConfigurationManager.AppSettings["UdpServicePort"], out port); return port; } }

        public static int BytesUdpServicePort { get { int port = 0; int.TryParse(ConfigurationManager.AppSettings["BytesUdpServicePort"], out port); return port; } }

        public static int CaptureInterval { get { int i = 0; int.TryParse(ConfigurationManager.AppSettings["CaptureInterval"], out i); return i; } }

        public static string CaptureImageFormat { get { return ConfigurationManager.AppSettings["CaptureImageFormat"]; } }

        public static bool IsBigScreen { get { bool b = false; bool.TryParse(ConfigurationManager.AppSettings["IsBigScreen"], out b); return b; } }

        public static void UpdateAppSetting(Dictionary<string, string> dict)
        {
            System.Configuration.Configuration config = System.Configuration.ConfigurationManager.OpenExeConfiguration(System.Configuration.ConfigurationUserLevel.None);

            foreach (var kvp in dict)
            {
                var ele = config.AppSettings.Settings[kvp.Key];
                if (ele == null)
                {
                    config.AppSettings.Settings.Add(new KeyValueConfigurationElement(kvp.Key, kvp.Value));
                }
                else ele.Value = kvp.Value;
            }

            config.Save(ConfigurationSaveMode.Modified);
            ConfigurationManager.RefreshSection("appSettings");
        }
    }
}
