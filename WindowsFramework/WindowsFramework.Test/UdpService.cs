using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Test
{
    public class UdpService
    {
        private UdpClient _Client { get; set; }
        private int _Port { get; set; }
        private Action<string> _Receive { get; set; }

        public UdpService(int port, Action<string> _receive)
        {
            _Port = port;
            _Receive = _receive;
        }

        public void Load()
        {
            var endPoint = new IPEndPoint(IPAddress.Parse(GetLocalIPAddress()), _Port);
            _Client = new UdpClient(endPoint);

            Task.Run(() =>
            {
                while (true)
                {
                    var receiveEndPoint = new IPEndPoint(IPAddress.Any, 0);
                    _Client.BeginReceive(delegate(IAsyncResult result)
                    {
                        _Receive(result.AsyncState.ToString());

                    }, Encoding.UTF8.GetString(_Client.Receive(ref receiveEndPoint)));
                }
            });
        }

        public void Send(string content)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(content);
            _Client.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse("255.255.255.255"), _Port));
        }

        private string GetLocalIPAddress()
        {

            IPHostEntry ipe = Dns.GetHostEntry(Dns.GetHostName());
            IPAddress[] ip = ipe.AddressList;
            for (int i = 0; i < ip.Length; i++)
            {
                if (ip[i].AddressFamily.ToString().Equals("InterNetwork"))
                {
                    return ip[i].ToString();
                }
            }
            return null;
        }
    }
}
