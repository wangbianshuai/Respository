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
    public class SocketListen
    {
        volatile Socket _Socket;

        public bool IsSend { get; set; }

        public ConcurrentDictionary<Guid, SessionState> SessionList { get; set; }

        public SocketListen(int port, int backlog, bool isSend, ConcurrentDictionary<Guid, SessionState> sessionList)
        {
            SessionList = sessionList;
            IsSend = isSend;

            _Socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            _Socket.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
            _Socket.Bind(new IPEndPoint(IPAddress.Any, port));
            _Socket.Listen(backlog);
            _Socket.SendTimeout = 3000;
            _Socket.ReceiveTimeout = 3000;
            _Socket.Blocking = false;
            _Socket.SendBufferSize = AppSettings.BufferSize;
            _Socket.ReceiveBufferSize = AppSettings.BufferSize;

            LoopAcceptAsync();
        }

        private void _AcceptAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            try
            {
                var taskSource = e.UserToken as TaskCompletionSource<bool>;
                this.ProcessAccept(e);
                taskSource.TrySetResult(true);
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketListen", "_AcceptAsyncEventArgs_Completed", ex);
            }
        }

        /// <summary>
        /// 开始异步循环接收连接
        /// </summary>
        /// <param name="arg"></param>
        async void LoopAcceptAsync()
        {
            while (this._Socket != null)
            {
                try
                {
                    var e = new SocketAsyncEventArgs();
                    e.Completed += _AcceptAsyncEventArgs_Completed;

                    await AcceptAsync(e);
                }
                catch (ObjectDisposedException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    LoggerProxy.Exception("SocketListen", "LoopAcceptAsync", ex);
                    break;
                }
            }
        }

        async Task AcceptAsync(SocketAsyncEventArgs e)
        {
            var taskSource = new TaskCompletionSource<bool>();
            e.AcceptSocket = null;
            e.UserToken = taskSource;

            if (_Socket.AcceptAsync(e))
            {
                await taskSource.Task;
            }
            else
            {
                this.ProcessAccept(e);
            }
        }

        private void ProcessAccept(SocketAsyncEventArgs e)
        {
            try
            {
                if (e.SocketError == SocketError.Success)
                {
                    new SocketSession(e.AcceptSocket, this);
                }
                else
                {
                    LoggerProxy.Exception("SocketListen", "ProcessAccept", new SocketException((int)e.SocketError));
                }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketListen", "ProcessAccept", ex);
            }
        }

        public void Dispose()
        {
            try
            {
                if (_Socket != null)
                {
                    if (_Socket.Connected) _Socket.Close();
                    _Socket.Dispose();
                    _Socket = null;
                }

                foreach (var kvp in SessionList)
                {
                    kvp.Value.ReceiveSession.Dispose();
                    kvp.Value.SendSession.Dispose();
                }
            }
            catch
            {

            }
        }
    }
}
