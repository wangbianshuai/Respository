using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class SocketConnect
    {
        volatile Socket _Socket;
        IPEndPoint _ServicePoint { get; set; }

        SocketClient _SocketClient { get; set; }

        public SocketConnect(string serviceHost, int port, SocketClient socketClient)
        {
            _SocketClient = socketClient;

            _Socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            _Socket.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
            _Socket.Blocking = false;
            _Socket.SendTimeout = 3000;
            _Socket.ReceiveTimeout = 3000;
            _Socket.SendBufferSize = AppSettings.BufferSize;
            _Socket.ReceiveBufferSize = AppSettings.BufferSize;

            _ServicePoint = new IPEndPoint(IPAddress.Parse(serviceHost), port);

            Connect();

            _IsCheckConnect = true;
        }

        async void Connect()
        {
            try
            {
                var e = new SocketAsyncEventArgs();
                e.RemoteEndPoint = _ServicePoint;
                e.Completed += _ConnectAsyncEventArgs_Completed;

                await ConnectAsync(e);
            }
            catch (Exception ex)
            {
                if (SocketClient.AlertAction != null)
                {
                    SocketClient.AlertAction(string.Format("{0}\n请检查YXINMT.MeetingSystem.WindowsSocketService是否启动！", Common.GetInnerException(ex).Message));
                }
                LoggerProxy.Exception("SocketConnect", "Connect", ex);
            }
        }

        async Task ConnectAsync(SocketAsyncEventArgs e)
        {
            var taskSource = new TaskCompletionSource<bool>();
            e.UserToken = taskSource;

            if (_Socket.ConnectAsync(e))
            {
                await taskSource.Task;
            }
            else
            {
                this.ProcessConnect(e);
            }
        }

        void ProcessConnect(SocketAsyncEventArgs e)
        {
            if (e.SocketError == SocketError.Success)
            {
                Task.Run(() => LoopReceiveAsync());

                Task.Run(() => LoopCheckConnect());

                //发送ID
                Send(AddDataId(this._SocketClient.Id.ToByteArray()));
            }
            else
            {
                var ex = new SocketException((int)e.SocketError);
                if (SocketClient.AlertAction != null)
                {
                    SocketClient.AlertAction(string.Format("{0}\n请检查YXINMT.MeetingSystem.WindowsSocketService是否启动！", Common.GetInnerException(ex).Message));
                }
                LoggerProxy.Exception("SocketConnect", "ProcessConnect", ex);
            }
        }

        async void Send(byte[] data)
        {
            try
            {
                byte[] data2 = AddDataId(data);
                var e = new SocketAsyncEventArgs();
                e.Completed += _SendAsynsEventArgs_Completed;
                e.SetBuffer(data2, 0, data2.Length);
                await SendAsync(e);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "Send", ex);
            }
        }

        async Task SendAsync(SocketAsyncEventArgs e)
        {
            var taskSource = new TaskCompletionSource<bool>();
            e.UserToken = taskSource;

            if (_Socket.SendAsync(e))
            {
                await taskSource.Task;
            }
            else
            {
                this.ProcessSend(e);
            }
        }

        void ProcessSend(SocketAsyncEventArgs e)
        {
            if (e.SocketError != SocketError.Success)
            {
                ReConnect();
                SocketException ex = new SocketException((int)e.SocketError);
                LoggerProxy.Exception("SocketConnect", "ProcessSend", ex);
            }
        }

        async void LoopReceiveAsync()
        {
            while (this.IsConnected)
            {
                try
                {
                    var e = new SocketAsyncEventArgs();
                    e.Completed += _ReceiveAsyncEventArgs_Completed;
                    byte[] buffer = new byte[AppSettings.BufferSize];
                    e.SetBuffer(buffer, 0, AppSettings.BufferSize);

                    await ReceiveAsync(e);
                }
                catch (ObjectDisposedException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    ReConnect();
                    LoggerProxy.Exception("SocketConnect", "LoopReceiveAsync", ex);
                    break;
                }
            }
        }

        async Task ReceiveAsync(SocketAsyncEventArgs e)
        {
            var taskSource = new TaskCompletionSource<bool>();
            e.UserToken = taskSource;

            if (_Socket.ReceiveAsync(e))
            {
                await taskSource.Task;
            }
            else
            {
                this.ProcessReceive(e);
            }
        }

        void ProcessReceive(SocketAsyncEventArgs e)
        {
            if (e.SocketError == SocketError.Success)
            {
                if (e.BytesTransferred > 0)
                {
                    byte[] data = new byte[e.BytesTransferred];
                    for (int i = 0; i < e.BytesTransferred; i++) data[i] = e.Buffer[i];
                    Receive(data);
                }
            }
            else
            {
                ReConnect();
                SocketException ex = new SocketException((int)e.SocketError);
                LoggerProxy.Exception("SocketConnect", "ProcessReceive", ex);
            }
        }

        private void _ReceiveAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            var taskSource = e.UserToken as TaskCompletionSource<bool>;
            this.ProcessReceive(e);
            taskSource.TrySetResult(true);
        }

        public bool IsSending { get; set; }

        static object _SendDataLock = new object();

        public void SendData()
        {
            lock (_SendDataLock)
            {
                if (IsSending || _SocketClient.SendDataList.IsEmpty) return;

                byte[] item = null;
                if (_SocketClient.SendDataList.TryDequeue(out item))
                {
                    IsSending = true;

                    Task.Run(() => Send(item));
                }
            }
        }

        void Receive(byte[] buffer)
        {
            try
            {
                //发送数据后接收客户端数据表示客户端已接收。
                if (buffer.Length == 1 && buffer[0] == 1)
                {
                    IsSending = false;
                    SendData();
                    return;
                }

                if (buffer.Length <= 16) return;

                byte[] dataIdbs = new byte[16];
                byte[] data = new byte[buffer.Length - 16];

                for (int i = 0; i < buffer.Length; i++)
                {
                    if (i < 16) dataIdbs[i] = buffer[i];
                    else data[i - 16] = buffer[i];
                }

                //判断是否通信数据
                Guid dataId = new Guid(dataIdbs);
                if (dataId != AppSettings.DataId) return;

                //回服务端已接收。
                _Socket.Send(new byte[] { 1 });

                if (_SocketClient.Receive != null) _SocketClient.Receive(data);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "Receive", ex);
            }
        }

        private void _SendAsynsEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            var taskSource = e.UserToken as TaskCompletionSource<bool>;
            this.ProcessSend(e);
            taskSource.TrySetResult(true);
        }

        private void _ConnectAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            var taskSource = e.UserToken as TaskCompletionSource<bool>;
            this.ProcessConnect(e);
            taskSource.TrySetResult(true);
        }

        byte[] AddDataId(byte[] data)
        {
            byte[] data2 = new byte[data.Length + 16];
            byte[] bs = AppSettings.DataId.ToByteArray();
            for (int i = 0; i < bs.Length; i++) data2[i] = bs[i];
            for (int i = 0; i < data.Length; i++) data2[i + 16] = data[i];

            return data2;
        }

        public bool IsConnected
        {
            get
            {
                try
                {
                    return _Socket != null && _Socket.Connected;
                }
                catch
                {
                    return false;
                }
            }
        }

        bool _IsCheckConnect { get; set; }

        void LoopCheckConnect()
        {
            try
            {
                if (_IsCheckConnect)
                {
                    Thread.Sleep(3000);
                    if (!IsConnected) ReConnect();

                    LoopCheckConnect();
                }
            }
            catch (ObjectDisposedException) {
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "LoopCheckConnect", ex);
            }
        }

        void ReConnect()
        {
            if (!_Socket.Connected)
            {
                _Socket.Close();
                _Socket.Connect(_ServicePoint);
                IsSending = false;
                SendData();
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
                    _IsCheckConnect = false;
                    IsSending = false;
                }
            }
            catch
            {

            }
        }
    }
}
