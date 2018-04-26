using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class SessionState
    {
        public Guid Id { get; set; }

        public string Ip { get; set; }

        public SocketSession SendSession { get; set; }

        public SocketSession ReceiveSession { get; set; }

        public System.Collections.Concurrent.ConcurrentQueue<byte[]> SendDataList { get; set; }
    }
}
