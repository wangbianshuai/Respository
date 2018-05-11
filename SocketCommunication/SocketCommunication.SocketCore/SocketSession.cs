using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
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

            LoopReceiveAsync();
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
                LoggerProxy.Exception("SocketSession", "_SendAsyncEventArgs_Completed", ex);
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
                LoggerProxy.Exception("SocketSession", "_SendAsyncEventArgs_Completed", ex);
            }
        }

        void AddMessage(string message)
        {
            _MessageList.Add(string.Format("{0}:{1},Date:{2}", _SocketListen.IsSend ? "发送" : "接收", message, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
        }

        bool _IsSending { get; set; }

        object _IsSendingLock = new object();

        public async void SendData()
        {
            try
            {
                if (!_IsSending) _IsSending = true;
                else return;

                while (_IsSending && _SessionState != null)
                {
                    _IsSending = _SessionState.SendDataList.Count > 0;

                    SendState item = null;
                    if (_SessionState.SendDataList.TryDequeue(out item))
                    {
                        await Send(item);
                    }

                    Thread.Sleep(30);
                }
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketSession", "SendData", ex);
            }
        }

        async Task Send(SendState state)
        {
            try
            {
                if (IsConnected)
                {
                    if (_SessionState != null) _SessionState.SendStateDictionary.AddOrUpdate(state.Id, state, (key, value) => state);

                    byte[] data2 = AddDataId(state.Data);
                    var e = new SocketAsyncEventArgs();
                    e.Completed += _SendAsyncEventArgs_Completed;
                    e.SetBuffer(data2, 0, data2.Length);

                    await SendAsync(e, state);
                }
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

                    if (_SessionState != null && _SessionState.SendStateDictionary.ContainsKey(state.Id))
                    {
                        SendState value = null;
                        if (state.IsSuccess) _SessionState.SendStateDictionary.TryRemove(state.Id, out value);
                        //30秒之内重发三次
                        else if (state.Ticks + 30 * 1000 > DateTime.Now.Ticks && state.SendCount < 3)
                        {
                            //重发
                            _SessionState.SendDataList.Enqueue(state);
                            SendData();
                        }
                    }
                }

                if (e.SocketError != SocketError.Success)
                {
                    SocketException ex = new SocketException((int)e.SocketError);
                    LoggerProxy.Exception("SocketSession", "ProcessSend", ex);

                    Dispose();
                }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketSession", "ProcessSend", ex);
            }
        }

        void Receive(byte [] buffer)
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
                        if (_SocketListen.IsSend) SendData();
                        return;
                    }
                }

                //分发数据
                Task.Run(() => SendToClient(data));
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketSession", "Receive", ex);
            }
        }

        void SendToClient(byte[] data)
        {
            try
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
                        if (i % 16 == 0)
                        {
                            ids = new byte[16];
                            ids[0] = idsbs[i];
                        }
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
                    s.SendDataList.Enqueue(new SendState(data2));
                    if (s.SendSession != null) s.SendSession.SendData();
                });

                AddMessage(string.Concat("收到数据字节数：", data.Length, ",发送客户端IP集合：", string.Join(",", stateList.Select(s => s.Ip))));
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("SocketSession", "SendToClient", ex);
            }
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
                    state.SendStateDictionary = new ConcurrentDictionary<Guid, SendState>();
                    state.Ip = ((IPEndPoint)_Socket.RemoteEndPoint).Address.ToString();
                    state.SendDataList = new ConcurrentQueue<SendState>();

                    if (this._SocketListen.IsSend) state.SendSession = this;
                    else state.ReceiveSession = this;

                    _SocketListen.SessionList.TryAdd(this.Id, state);
                }

                RemoveSession();

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
                    LoggerProxy.Exception("SocketSession", "ProcessReceive", ex);

                    Dispose();
                }
            }
            catch(Exception ex)
            {
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

        public void Dispose()
        {
            try
            {
                if (_Socket != null)
                {
                    _Socket.Close();
                    _Socket.Dispose();
                    _Socket = null;

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
