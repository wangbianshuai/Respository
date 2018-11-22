using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class SocketServer
    {
        volatile SocketListen _SendSocket;
        volatile SocketListen _ReceiveSocket;

        int _SendPort { get; set; }
        int _ReceivePort { get; set; }

        public int Backlog { get; set; }

        ConcurrentDictionary<Guid, SessionState> _SessionList { get; set; }

        public void Start()
        {
            try
            {
                _SessionList = new ConcurrentDictionary<Guid, SessionState>();

                //发送Socket
                _SendSocket = new SocketListen(_SendPort, Backlog, true, _SessionList);

                //接收Socket
                _ReceiveSocket = new SocketListen(_ReceivePort, Backlog, false, _SessionList);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketServer", "Start", ex);
            }
        }

        public SocketServer()
        {
            _SendPort = AppSettings.SocketServiceSendPort;
            _ReceivePort = AppSettings.SocketServiceReceivePort;

            Backlog = 128;
        }

        /// <summary>
        /// 析构函数
        /// </summary>
        ~SocketServer()
        {
            this.Dispose();
        }

        public void Dispose()
        {
            try
            {
                _SendSocket.Dispose();
                _ReceiveSocket.Dispose();
            }
            catch
            {

            }
        }
    }
}
