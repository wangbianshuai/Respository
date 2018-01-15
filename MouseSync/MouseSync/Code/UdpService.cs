using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace MouseSync.Code
{
    public class UdpService
    {
        UdpClient _SendClient { get; set; }
        UdpClient _IpSendClient { get; set; }
        UdpClient _ReceiveClient { get; set; }
        private int _Port { get; set; }
        private Action<string> _Receive { get; set; }
        Action<byte[]> _ReceiveBytes { get; set; }
        public string LocalIPAddress { get; set; }
        IPEndPoint _ReceiveEndPoint { get; set; }
        public string GateWayIPAddress { get; set; }

        ConcurrentDictionary<Guid, List<ReceiveItem>> _ReciveDataDictionary = new ConcurrentDictionary<Guid, List<ReceiveItem>>();

        public UdpService(int port, Action<string> _receive)
        {
            _Port = port;
            _Receive = _receive;
            LocalIPAddress = Common.GetLocalIPAddress();
            Load();
        }

        public UdpService(int port, Action<byte[]> _receiveBytes)
        {
            _Port = port;
            _ReceiveBytes = _receiveBytes;
            LocalIPAddress = Common.GetLocalIPAddress();
            Load();
        }

        private void Load()
        {
            try
            {
                _SendItemList = new ConcurrentQueue<SendItem>();
                _ReceiveEndPoint = new IPEndPoint(IPAddress.Any, _Port);
                _ReceiveClient = new UdpClient(_ReceiveEndPoint);

                _SendClient = new UdpClient();
                _IpSendClient = new UdpClient();

                if (string.IsNullOrEmpty(GateWayIPAddress)) GateWayIPAddress = "255.255.255.255";

                Task.Factory.StartNew(() => Receive());
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("DataDistribution", "Load", ex);
            }
        }

        private void Receive()
        {
            try
            {
                while (true)
                {
                    IPEndPoint receiveEndPoint = _ReceiveEndPoint;

                    byte[] data = _ReceiveClient.Receive(ref receiveEndPoint);

#if DEBUG
                    //debug
                    SetReceive(data);
#else
                    //release
                    if (receiveEndPoint.Address.ToString() != LocalIPAddress && data != null) SetReceive(data);
#endif
                }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("DataDistribution", "Receive", ex);
            }
        }

        private void SetReceive(byte[] content)
        {
            Task.Run(() =>
            {
                lock (this) ParseReceiveData(content);
            });
        }

        private void ParseReceiveData(byte[] content)
        {
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
            item.Length =length;
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
                            data[index] = itemList[i].Data[j];
                            index += 1;
                        }
                    }

                    if (data.Length == length)
                    {
                       if(_Receive!=null)  _Receive(Encoding.UTF8.GetString(data));
                       if (_ReceiveBytes != null) _ReceiveBytes(data);
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

        public void Send(string content, List<string> ipList)
        {
            Task.Factory.StartNew(() => SendData(Encoding.UTF8.GetBytes(content), ipList));
        }

        public void SendBytes(byte[] data)
        {
            SendBytes(data, null);
        }

        public void SendBytes(byte[] data, List<string> ipList)
        {
            Task.Factory.StartNew(() => SendData(data, ipList));
        }

        private void Send(byte[] bytes, List<string> ipList)
        {

#if DEBUG
            //debug
            if (_Port == 8765 || _Port == 8766)
            {
                int port = _Port == 8765 ? 8865 : 8866;
                if (ipList == null || ipList.Count == 0) _SendClient.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse(GateWayIPAddress), port));
                else ipList.ForEach(ip => SendToIp(bytes, ip));
            }

            if (_Port == 8865 || _Port == 8866)
            {
                int port = _Port == 8865 ? 8765 : 8766;
                if (ipList == null || ipList.Count == 0) _SendClient.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse(GateWayIPAddress), port));
                else ipList.ForEach(ip => SendToIp(bytes, ip));
            }
#else
            //release
            if (ipList == null || ipList.Count == 0) _SendClient.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse(GateWayIPAddress), _Port));
            else ipList.ForEach(ip => SendToIp(bytes, ip));
#endif
        }

        System.Collections.Concurrent.ConcurrentQueue<SendItem> _SendItemList { get; set; }

        void SendToIp(byte[] bytes, string ip)
        {
            try
            {
#if DEBUG
                //debug
                if (_Port == 8765 || _Port == 8766)
                {
                    int port = _Port == 8765 ? 8865 : 8866;
                   _IpSendClient.Connect(new IPEndPoint(IPAddress.Parse(ip), port));
                }

                if (_Port == 8865 || _Port == 8866)
                {
                    int port = _Port == 8865 ? 8765 : 8766;
                    _IpSendClient.Connect(new IPEndPoint(IPAddress.Parse(ip), port));
                }
#else
            //release
            _IpSendClient.Connect(new IPEndPoint(IPAddress.Parse(ip), _Port));
#endif
                _IpSendClient.Send(bytes, bytes.Length);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("UpdService", "SendToIp", ex);
            }
        }

        private void SendData(byte[] bytes, List<string> ipList)
        {
            try
            {
                Guid id = Guid.NewGuid();
                byte[] gbs = id.ToByteArray();

                List<byte[]> batchList = Common.ArrayToBatchList<byte>(bytes, 8000, (i, count, len) =>
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

                batchList.ForEach(b => _SendItemList.Enqueue(new SendItem() { Data = b, IpList = ipList }));

                lock (this) { if (_IsSending) return; SendData(); }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("DataDistribution", "SendData", ex);
            }
        }

        bool _IsSending { get; set; }

        void SendData()
        {
            SendItem item = null;
            if (_SendItemList.TryDequeue(out item))
            {
                Send(item.Data, item.IpList);
            }

            _IsSending = !_SendItemList.IsEmpty && _SendItemList.Count > 0;

            if (_IsSending) SendData();
        }
    }

    public class ReceiveItem
    {
        public int Index { get; set; }
        public int Count { get; set; }
        public int Length { get; set; }
        public byte[] Data { get; set; }
    }

    public class SendItem
    {
        public byte[] Data { get; set; }
        public List<string> IpList { get; set; }
    }
}
