using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace AbetAccount.Utility
{
    public class SignalRClient
    {
        HubConnection _Connection { get; set; }

        public SignalRClient(string url, Action<string, string, long, string> receive)
        {
            _Connection = new HubConnectionBuilder().WithUrl(url).Build();
            _Connection.On("ReceiveMessage", receive);
        }

        public Task Start()
        {
           return _Connection.StartAsync();
        }

        public Task Send(string token, Guid id, string userId, bool isOrder, string type, string message)
        {
            if (_Connection.State != HubConnectionState.Connected) return null;

            return _Connection.InvokeAsync("SendMessage", token, id, userId, isOrder, type, message);
        }

        public Task SendClearChatRecord(string token)
        {
            if (_Connection.State != HubConnectionState.Connected) return null;

            return _Connection.InvokeAsync("SendClearChatRecord", token, "122081FC-D410-421B-93D3-9961783D1778");
        }

        public void Close()
        {
            _Connection.DisposeAsync();
        }
    }
}
