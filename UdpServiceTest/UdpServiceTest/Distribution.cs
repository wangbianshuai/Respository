using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UdpServiceTest
{
    /// <summary>
    /// 分发
    /// </summary>
    public class Distribution
    {
        static UdpService _UdpService { get; set; }

        static Distribution()
        {
            try
            {
                _UdpService = new UdpService(AppSetting.UdpServicePort, (data, ip) => Receive(data, ip));
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("Distribution", "Distribution", ex);
            }
        }

        /// <summary>
        /// 是否发送者
        /// </summary>
        public static bool IsSender { get; set; }

        /// <summary>
        /// 是否接收者
        /// </summary>
        public static bool IsReceiver { get; set; }

        /// <summary>
        /// 分发数据
        /// </summary>
        /// <param name="data"></param>
        /// <param name="actionType"></param>
        /// <param name="ipList"></param>
        public static void Send(object data, int actionType, Guid id, List<string> ipList)
        {
            try
            {
                DistributionData distdata = new DistributionData();

                distdata.ActionType = actionType;
                distdata.Id = id;

                string content = string.Empty;

                if (data != null && data is string) content = (string)data;
                else if (data != null) content = JsonConvert.SerializeObject(data);

                distdata.Data = content;

                _UdpService.Send(JsonConvert.SerializeObject(distdata), ipList);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("Distribution", "Send", ex);
            }
        }

        /// <summary>
        /// 调度状态分发
        /// </summary>
        public static void Dispatch(object data, int actionType, Guid id)
        {
            SetDispatch(data, actionType);
        }

        public static Action<object, int> SetDispatch { get; set; }

        /// <summary>
        /// 接收数据
        /// </summary>
        /// <param name="data"></param>
        private static void Receive(string data, string ip)
        {
            try
            {
                if (string.IsNullOrEmpty(data)) throw new Exception("接收内容为空。");

                DistributionData distdata = JsonConvert.DeserializeObject<DistributionData>(data);

                Dispatch(distdata.Data, distdata.ActionType, distdata.Id);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("Distribution", "Receive", ex);
            }
        }
    }

    public class DistributionData
    {
        public string Data { get; set; }
        public Guid Id { get; set; }
        public int ActionType { get; set; }
    }
}
