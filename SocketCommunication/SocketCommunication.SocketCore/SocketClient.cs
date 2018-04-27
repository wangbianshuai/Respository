using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class SocketClient
    {
        public static Action<string> AlertAction { get; set; }

        public ConcurrentQueue<SendState> SendDataList { get; set; }

        public ConcurrentDictionary<Guid, SendState> SendStateDictionary { get; set; }

        public Guid Id { get; set; }

        volatile SocketConnect _SendSocket;
        volatile SocketConnect _ReceiveSocket;

        public Action<byte[]> Receive { get; set; }

        int _SendPort { get; set; }
        int _ReceivePort { get; set; }

        string _ServiceHost { get; set; }

        public void Connect()
        {
            try
            {
                //发送Socket
                _SendSocket = new SocketConnect(_ServiceHost, _SendPort, this, true);

                //接收Socket
                _ReceiveSocket = new SocketConnect(_ServiceHost, _ReceivePort, this, false);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketClient", "Start", ex);
            }
        }

        public SocketClient()
        {
            Init();
        }

        void Init()
        {
            _SendPort = AppSettings.SocketServiceSendPort;
            _ReceivePort = AppSettings.SocketServiceReceivePort;

            _ServiceHost = AppSettings.SocketServiceHost;

            Id = Guid.NewGuid();

            SendDataList = new ConcurrentQueue<SendState>();
            SendStateDictionary = new ConcurrentDictionary<Guid, SendState>();

            _ReciveDataDictionary = new ConcurrentDictionary<Guid, List<ReceiveItem>>();

        }

        public void Send(byte[] data, List<Guid> clientIdList)
        {
            if (data == null) return;

            int count = 0;
            if (clientIdList != null && clientIdList.Count > 0) count = clientIdList.Count * 16;

            byte[] data2 = new byte[data.Length + count + 4];

            byte[] idcountbs = BitConverter.GetBytes(count);
            for (int i = 0; i < idcountbs.Length; i++) data2[i] = idcountbs[i];

            int index = 4;
            if (clientIdList != null && clientIdList.Count > 0)
            {
                clientIdList.ForEach(id =>
                {
                    byte[] bs = id.ToByteArray();

                    for (int i = 0; i < bs.Length; i++)
                    {
                        data2[index] = bs[i];
                        index += 1;
                    }
                });
            }

            for (int i = 0; i < data.Length; i++)
            {
                data2[index] = data[i];
                index += 1;
            }

            SendDataList.Enqueue(new SendState(data2));
           _SendSocket.SendData();
        }

        /// <summary>
        /// 析构函数
        /// </summary>
        ~SocketClient()
        {
            this.Dispose();
        }

        public void Dispose()
        {
            try
            {
                _SendSocket.Dispose();
                _ReceiveSocket.Dispose();
            }
            catch
            {

            }
        }
       
        Action<string> _Receive { get; set; }
        Action<byte[]> _ReceiveBytes { get; set; }

        public SocketClient(Action<string> _receive)
        {
            _Receive = _receive;
            Receive = (bs) => SetReceive(bs);
            Init();
            Connect();
        }

        public SocketClient(Action<byte[]> _receiveBytes)
        {
            _ReceiveBytes = _receiveBytes;
            Receive = (bs) => SetReceive(bs);
            Init();
            Connect();
        }

        ConcurrentDictionary<Guid, List<ReceiveItem>> _ReciveDataDictionary { get; set; }

        private void SetReceive(byte[] content)
        {
            Task.Run(() =>
            {
                try
                {
                    ParseReceiveData(content);
                }
                catch (Exception ex)
                {
                    LoggerProxy.Exception("SocketClient", "SetReceive", ex);
                }
            });
        }

        private void ParseReceiveData(byte[] content)
        {
            if (content.Length <= 28) return;

            byte[] idbs = new byte[16];
            byte[] indexbs = new byte[4];
            byte[] countbs = new byte[4];
            byte[] lengthbs = new byte[4];
            byte[] data = new byte[content.Length - 28];

            for (int i = 0; i < content.Length; i++)
            {
                if (i < 16) idbs[i] = content[i];
                else if (i < 20) indexbs[i - 16] = content[i];
                else if (i < 24) countbs[i - 20] = content[i];
                else if (i < 28) lengthbs[i - 24] = content[i];
                else data[i - 28] = content[i];
            }

            int count = BitConverter.ToInt32(countbs, 0);
            int length = BitConverter.ToInt32(lengthbs, 0);
            if (count == 1 && data.Length == length)
            {
                if (_Receive != null) _Receive(Encoding.UTF8.GetString(data));
                if (_ReceiveBytes != null) _ReceiveBytes(data);
                return;
            }

            ReceiveItem item = new ReceiveItem();
            item.Index = BitConverter.ToInt32(indexbs, 0);
            item.Length = length;
            item.Count = count;
            item.Data = data;

            Guid id = new Guid(idbs);

            if (_ReciveDataDictionary.ContainsKey(id))
            {
                List<ReceiveItem> itemList = _ReciveDataDictionary[id];
                itemList.Add(item);

                if (count == itemList.Count)
                {
                    itemList = itemList.OrderBy(b => b.Index).ToList();

                    data = new byte[length];

                    length = 0;
                    int index = 0;
                    for (int i = 0; i < itemList.Count; i++)
                    {
                        length += itemList[i].Data.Length;
                        for (int j = 0; j < itemList[i].Data.Length; j++)
                        {
                            if (index < data.Length)
                            {
                                data[index] = itemList[i].Data[j];
                                index += 1;
                            }
                        }
                    }

                    if (data.Length == length)
                    {
                        if (_Receive != null) _Receive(Encoding.UTF8.GetString(data));
                        if (_ReceiveBytes != null) _ReceiveBytes(data);

                        _ReciveDataDictionary.TryRemove(id, out itemList);
                    }
                }
            }
            else
            {
                _ReciveDataDictionary.AddOrUpdate(id, new List<ReceiveItem>() { item }, (key, value) => { return value; });
            }
        }

        public void Send(string content)
        {
            Send(content, null);
        }

        public void Send(string content, List<Guid> ipList)
        {
            Task.Run(() => SendData(Encoding.UTF8.GetBytes(content), ipList));
        }

        public void SendBytes(byte[] data)
        {
            SendBytes(data, null);
        }

        public void SendBytes(byte[] data, List<Guid> ipList)
        {
            Task.Run(() => SendData(data, ipList));
        }

        private void SendData(byte[] bytes, List<Guid> ipList)
        {
            if (bytes == null) return;

            try
            {
                int size = AppSettings.StepSize;
                if (ipList != null && ipList.Count > 0) size -= ipList.Count * 16;

                Guid id = Guid.NewGuid();
                byte[] gbs = id.ToByteArray();

                List<byte[]> batchList = Common.ArrayToBatchList<byte>(bytes, size, (i, count, len) =>
                {
                    List<byte> bList = new List<byte>();

                    bList.AddRange(gbs);
                    bList.AddRange(System.BitConverter.GetBytes(i));
                    bList.AddRange(System.BitConverter.GetBytes(count));
                    bList.AddRange(System.BitConverter.GetBytes(bytes.Length));

                    byte[] bs2 = new byte[len + 28];

                    for (int j = 0; j < bList.Count; j++) bs2[j] = bList[j];

                    return bs2;
                }, 28);

                batchList.ForEach(b => Send(b, ipList));
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("SocketClient", "SendData", ex);
            }
        }
    }

    public class ReceiveItem
    {
        public int Index { get; set; }
        public int Count { get; set; }
        public int Length { get; set; }
        public byte[] Data { get; set; }
    }

}
