using System;
using System.Collections.Concurrent;
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

        public ConcurrentQueue<SendState> SendDataList { get; set; }

        public ConcurrentDictionary<Guid, SendState> SendStateDictionary { get; set; }
    }

    public class SendState
    {
        public byte[] Data { get; set; }
        public long Ticks { get; set; }
        public bool IsSuccess { get; set; }
        public Guid Id { get; set; }
        public int SendCount { get; set; }

        public SendState(byte[] data)
        {
            Data = data;
            Ticks = DateTime.Now.Ticks;
            Id = Guid.NewGuid();
        }
    }

    public class SendTaskState
    {
        public SendState State { get; set; }
        public TaskCompletionSource<bool> TaskSource { get; set; }
    }
}
