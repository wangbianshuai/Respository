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
        /// <summary>
        /// 发送端口
        /// </summary>
        public static int SocketServiceSendPort { get { int port = 0; int.TryParse(ConfigurationManager.AppSettings["SocketServiceSendPort"], out port); return port; } }
        /// <summary>
        /// 收接端口
        /// </summary>
        public static int SocketServiceReceivePort { get { int port = 0; int.TryParse(ConfigurationManager.AppSettings["SocketServiceReceivePort"], out port); return port; } }
        /// <summary>
        /// 服务端主机
        /// </summary>
        public static string SocketServiceHost { get { return ConfigurationManager.AppSettings["SocketServiceHost"]; } }

        public static readonly Guid DataId = new Guid("0B522FBD-9AC1-4E83-9003-6893356E28CC");

        public static readonly int BufferSize = 1024 * 1024;
        public static readonly int StepSize = 1000 * 1024;
    }
}
