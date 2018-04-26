using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class SocketSession
    {
        public Guid Id { get; set; }

        bool _Closed { get; set; }

        Socket _Socket { get; set; }

        SocketListen _SocketListen { get; set; }

        SessionState _SessionState { get; set; }

        List<string> _MessageList = new List<string>();

        public SocketSession(Socket socket, SocketListen socketListen)
        {
            _Socket = socket;
            _SocketListen = socketListen;
            _MessageList = new List<string>();

            AddMessage(string.Format("{0}已链接", _Socket.RemoteEndPoint.ToString()));

            Task.Run(() => LoopReceiveAsync());
        }

        private void _SendAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            var taskSource = e.UserToken as TaskCompletionSource<bool>;
            this.ProcessSend(e);
            taskSource.TrySetResult(true);
        }

        private void _ReceiveAsyncEventArgs_Completed(object sender, SocketAsyncEventArgs e)
        {
            var taskSource = e.UserToken as TaskCompletionSource<bool>;
            this.ProcessReceive(e);
            taskSource.TrySetResult(true);
        }

        void AddMessage(string message)
        {
            _MessageList.Add(string.Format("{0}:{1},Date:{2}", _SocketListen.IsSend ? "发送" : "接收", message, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
        }
        
        public bool IsSending { get; set; }

        static object _SendDataLock = new object();

        public void SendData()
        {
            lock (_SendDataLock)
            {
                if (_SessionState == null || IsSending || _SessionState.SendDataList.IsEmpty) return;

                byte[] item = null;
                if (_SessionState.SendDataList.TryDequeue(out item))
                {
                    IsSending = true;

                    Task.Run(() => Send(item));
                }
            }
        }

        async void Send(byte[] data)
        {
            try
            {
                byte[] data2 = AddDataId(data);
                var e = new SocketAsyncEventArgs();
                e.Completed += _SendAsyncEventArgs_Completed;
                e.SetBuffer(data2, 0, data2.Length);
                await SendAsync(e);
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketSession", "Send", ex);
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
                Dispose();
                SocketException ex = new SocketException((int)e.SocketError);
                LoggerProxy.Exception("SocketSession", "ProcessSend", ex);
            }
        }

        void Receive(byte [] buffer)
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

                //接收客户端ID
                if (data.Length == 32)
                {
                    dataIdbs = new byte[16];
                    byte[] data2 = new byte[16];

                    for (int i = 0; i < data.Length; i++)
                    {
                        if (i < 16) dataIdbs[i] = data[i];
                        else data2[i - 16] = data[i];
                    }

                    dataId = new Guid(dataIdbs);

                    if (dataId == AppSettings.DataId)
                    {
                        this.Id = new Guid(data2);
                        _SessionState = AddSession();
                        return;
                    }
                }

                //回客户端已接收。
                _Socket.Send(new byte[] { 1 });

                //分发数据
                Task.Run(() => SendToClient(data));
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketSession", "Receive", ex);
            }
        }

        void SendToClient(byte[] data)
        {
            byte[] idcountbs = new byte[4];
            for (int i = 0; i < 4; i++) idcountbs[i] = data[i];

            byte[] data2 = null;

            List<SessionState> stateList = null;
            int count = BitConverter.ToInt32(idcountbs, 0);
            if (count == 0)
            {
                data2 = new byte[data.Length - 4];
                for (int i = 4; i < data.Length; i++) data2[i - 4] = data[i];

                stateList = (from a in _SocketListen.SessionList
                             where a.Key != this.Id
                             select a.Value).ToList();
            }
            else
            {
                byte[] idsbs = new byte[count];
                data2 = new byte[data.Length - 4 - count];

                for (int i = 4; i < data.Length; i++)
                {
                    if (i - 4 < count) idsbs[i - 4] = data[i];
                    else data2[i - 4 - count] = data[i];
                }

                List<Guid> idList = new List<Guid>();

                byte[] ids = null;
                int k = 0;
                for (int i = 0; i < idsbs.Length; i++)
                {
                    if (i % 16 == 0) ids = new byte[16];
                    else
                    {
                        k = i / 16 * 16;
                        ids[i - k] = idsbs[i];
                        if (i - k == 15) idList.Add(new Guid(ids));
                    }
                }

                stateList = (from a in _SocketListen.SessionList
                             from b in idList
                             where a.Key != this.Id && a.Key == b
                             select a.Value).ToList();
            }

            stateList.ForEach(s =>
            {
                s.SendDataList.Enqueue(data2);
                if (s.SendSession != null && !s.SendSession.IsSending) s.SendSession.SendData();
            });

            AddMessage(string.Concat("收到数据字节数：", data.Length, ",发送客户端IP集合：", string.Join(",", stateList.Select(s => s.Ip))));
        }

        static object _AddSessionLock = new object();

        SessionState AddSession()
        {
            lock (_AddSessionLock)
            {
                SessionState state = null;
                if (_SocketListen.SessionList.ContainsKey(this.Id))
                {
                    state = _SocketListen.SessionList[this.Id];

                    if (this._SocketListen.IsSend) state.SendSession = this;
                    else state.ReceiveSession = this;
                }
                else
                {
                    state = new SessionState();
                    state.Id = this.Id;
                    state.Ip = ((IPEndPoint)_Socket.RemoteEndPoint).Address.ToString();
                    state.SendDataList = new System.Collections.Concurrent.ConcurrentQueue<byte[]>();

                    if (this._SocketListen.IsSend) state.SendSession = this;
                    else state.ReceiveSession = this;

                    _SocketListen.SessionList.TryAdd(this.Id, state);
                }

                RemoveSession();

                IsSending = false;
                SendData();

                return state;
            }
        }

        void RemoveSession()
        {
            var list = (from a in _SocketListen.SessionList
                        where (a.Value.ReceiveSession == null || !a.Value.ReceiveSession.IsConnected)
                        && (a.Value.SendSession == null || !a.Value.SendSession.IsConnected)
                        select a.Value).ToList();

            list.ForEach(a =>
            {
                SessionState value = null;
                _SocketListen.SessionList.TryRemove(a.Id, out value);
            });
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
                    Dispose();
                    LoggerProxy.Exception("SocketSession", "LoopReceiveAsync", ex);
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
                Dispose();
                SocketException ex = new SocketException((int)e.SocketError);
                LoggerProxy.Exception("SocketSession", "ProcessReceive", ex);
            }
        }

        /// <summary>
        /// 获取是否已连接到远程端
        /// </summary>
        public bool IsConnected
        {
            get
            {
                return _Socket != null && _Socket.Connected;
            }
        }

        public void Dispose()
        {
            try
            {
                if (_Socket != null)
                {
                    _Socket.Close();
                    _Socket.Dispose();
                    _Socket = null;

                    IsSending = false;
                    LoggerProxy.Info("SocketSession", "Dispose", _MessageList);

                    RemoveSession();
                }
            }
            catch
            {

            }
        }
    }
}
