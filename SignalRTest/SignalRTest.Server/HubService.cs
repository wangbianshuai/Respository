using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SignalRTest.Server
{
    [HubName("HubService")]
    public class HubService : Hub
    {
        public void Send(string content, List<string> receiverIdList)
        {
            try
            {
                if (receiverIdList == null || receiverIdList.Count == 0) Clients.All.Receive(content, this.Context.ConnectionId);
                else Clients.Clients(receiverIdList).Receive(content, this.Context.ConnectionId);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dict = new Dictionary<string, string>();
                dict.Add("Content", content);
                LoggerProxy.Exception("HubService", "Send", ex, dict);
            }
        }
    }
}