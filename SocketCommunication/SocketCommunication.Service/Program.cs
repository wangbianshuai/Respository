using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.Service
{
    class Program
    {
        static void Main(string[] args)
        {
            SocketCore.SocketServer server = new SocketCore.SocketServer();
            server.Start();

            Console.WriteLine("启动服务");
         
            Console.ReadLine();
        }
    }
}
