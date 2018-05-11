using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class AppSettings
    {
        public static Dictionary<string, object> Data { get; set; }

        /// <summary>
        /// 发送端口
        /// </summary>
        public static int SocketServiceSendPort { get { return GetAppSettingsValue<int>("SocketServiceSendPort"); } }
        /// <summary>
        /// 收接端口
        /// </summary>
        public static int SocketServiceReceivePort { get { return GetAppSettingsValue<int>("SocketServiceReceivePort"); } }
        /// <summary>
        /// 服务端主机
        /// </summary>
        public static string SocketServiceHost { get { return GetAppSettingsValue<string>("SocketServiceHost"); } }

        public static readonly Guid DataId = new Guid("0B522FBD-9AC1-4E83-9003-6893356E28CC");

        public static readonly int BufferSize = 1024 * 1024;
        public static readonly int StepSize = 1000 * 1024;

        static T GetAppSettingsValue<T>(string name, object defaultValue = null)
        {
            string value = ConfigurationManager.AppSettings[name];

            object obj = value;
            if (string.IsNullOrEmpty(value) && Data != null && Data.ContainsKey(name))
            {
                obj = Data[name];
            }

            if (obj == null && defaultValue != null) return Common.GetValue<T>(defaultValue);

            return Common.GetValue<T>(obj);
        }
    }
}
