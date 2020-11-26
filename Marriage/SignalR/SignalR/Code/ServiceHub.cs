using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalR.Code
{
    public class ServiceHub : Hub
    {
        public async Task SendMessage(string type, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", type, message);
        }

        public async Task SendMessageToUser(string connectionId, string type, string message)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", type, message);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Clients.All.SendAsync("ReceiveMessage", "Disconnection", Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
