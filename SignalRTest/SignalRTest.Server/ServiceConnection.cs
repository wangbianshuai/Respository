using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SignalRTest.Server
{
    public class ServiceConnection : PersistentConnection
    {
        protected override Task OnReceived(IRequest request, string connectionId, string data)
        {
            try
            {
                return Connection.Broadcast(data, connectionId);
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dict = new Dictionary<string, string>();
                dict.Add("Data", data);
                LoggerProxy.Exception("ServiceConnection", "OnReceived", ex, dict);

                return base.OnReceived(request, connectionId, data);
            }
        }
    }
}