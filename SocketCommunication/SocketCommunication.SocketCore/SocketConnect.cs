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

        bool _IsSend { get; set; }

        public SocketConnect(string serviceHost, int port, SocketClient socketClient, bool isSend)
        {
            _SocketClient = socketClient;
            _IsSend = isSend;

            Init();

            _ServicePoint = new IPEndPoint(IPAddress.Parse(serviceHost), port);

            Connect();

            _IsCheckConnect = true;
        }

        void Init()
        {
            _Socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            _Socket.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
            _Socket.SendTimeout = 3000;
            _Socket.ReceiveTimeout = 3000;
            _Socket.Blocking = false;
            _Socket.SendBufferSize = AppSettings.BufferSize;
            _Socket.ReceiveBufferSize = AppSettings.BufferSize;
        }

        async void Connect()
        {
            try
            {
                _IsSending = false;
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
            try
            {
                if (e.SocketError == SocketError.Success)
                {
                    LoopReceiveAsync();

                    Task.Run(() => LoopCheckConnect());

                    //发送ID
                    _SocketClient.SendDataList.Enqueue(new SendState(AddDataId(this._SocketClient.Id.ToByteArray())));
                    SendData();
                }
                else
                {
                    if (!_IsSend)
                    {
                        var ex = new SocketException((int)e.SocketError);
                        if (SocketClient.AlertAction != null)
                        {
                            SocketClient.AlertAction(string.Format("{0}\n请检查YXINMT.MeetingSystem.WindowsSocketService是否启动！", Common.GetInnerException(ex).Message));
                        }
                        LoggerProxy.Exception("SocketConnect", "ProcessConnect", ex);
                    }
                }
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "ProcessConnect", ex);
            }
        }

        async Task Send(SendState state)
        {
            try
            {
                if (IsConnected)
                {
                    _SocketClient.SendStateDictionary.AddOrUpdate(state.Id, state, (key, value) => state);

                    byte[] data2 = AddDataId(state.Data);
                    var e = new SocketAsyncEventArgs();
                    e.Completed += _SendAsyncEventArgs_Completed;
                    e.SetBuffer(data2, 0, data2.Length);

                    await SendAsync(e, state);
                }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "Send", ex);
            }
        }

        async Task SendAsync(SocketAsyncEventArgs e, SendState state)
        {
            var taskSource = new TaskCompletionSource<bool>();

            e.UserToken = new SendTaskState() { State = state, TaskSource = taskSource };

            if (_Socket.SendAsync(e))
            {
                await taskSource.Task;
            }
            else
            {
                this.ProcessSend(e, state);
            }
        }

        void ProcessSend(SocketAsyncEventArgs e, SendState state)
        {
            try
            {
                if (state != null)
                {
                    state.IsSuccess = e.SocketError == SocketError.Success;
                    state.SendCount += 1;

                    if (_SocketClient.SendStateDictionary.ContainsKey(state.Id))
                    {
                        SendState value = null;
                        if (state.IsSuccess) _SocketClient.SendStateDictionary.TryRemove(state.Id, out value);
                        //30秒之内重发三次
                        else if (state.Ticks + 30 * 1000 > DateTime.Now.Ticks && state.SendCount < 3)
                        {
                            //重发
                            _SocketClient.SendDataList.Enqueue(state);
                            SendData();
                        }
                    }
                }

                if (e.SocketError != SocketError.Success)
                {
                    SocketException ex = new SocketException((int)e.SocketError);
                    LoggerProxy.Exception("SocketConnect", "ProcessSend", ex);
                    Dispose();
                }
            }
            catch(Exception ex)
            {
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
                    _Socket.Disconnect(true);
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
            try
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
                    SocketException ex = new SocketException((int)e.SocketError);
                    LoggerProxy.Exception("SocketConnect", "ProcessReceive", ex);

                    _Socket.Disconnect(true);
                    ReConnect();
                }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "ProcessReceive", ex);
            }
        }

        private void _ReceiveAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            try
            {
                var taskSource = e.UserToken as TaskCompletionSource<bool>;
                this.ProcessReceive(e);
                taskSource.TrySetResult(true);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "_ReceiveAsyncEventArgs_Completed", ex);
            }
        }

        object _IsSendingLock = new object();

        bool _IsSending { get; set; }

        public async void SendData()
        {
            try
            {
                if (!_IsSending) _IsSending = true;
                else return;

                while (_IsSending)
                {
                    _IsSending = _SocketClient.SendDataList.Count > 0;

                    SendState item = null;
                    if (_SocketClient.SendDataList.TryDequeue(out item))
                    {
                        await Send(item);
                    }

                    Thread.Sleep(30);
                }
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "SendData", ex);
            }
        }

        void Receive(byte[] buffer)
        {
            try
            {  
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

                if (_SocketClient.Receive != null) _SocketClient.Receive(data);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "Receive", ex);
            }
        }

        private void _SendAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            try
            {
                var taskState = e.UserToken as SendTaskState;
                this.ProcessSend(e, taskState.State);
                taskState.TaskSource.TrySetResult(true);
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "_SendAsyncEventArgs_Completed", ex);
            }
        }

        private void _ConnectAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            try
            {
                var taskSource = e.UserToken as TaskCompletionSource<bool>;
                this.ProcessConnect(e);
                taskSource.TrySetResult(true);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "_ConnectAsyncEventArgs_Completed", ex);
            }
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
            try
            {
                if (_Socket == null) Init();
                if (!_Socket.Connected)
                {
                    Connect();
                    SendData();
                }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketConnect", "ReConnect", ex);
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
                }
            }
            catch
            {

            }
        }
    }
}
