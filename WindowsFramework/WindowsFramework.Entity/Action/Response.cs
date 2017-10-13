using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Entity.Action
{
    public interface IResponse
    {
        Ack Ack { get; set; }
    }

    public class Response : IResponse
    {
        public Ack Ack { get; set; }

        public Response()
        {
            Ack = new Ack();
        }
    }

    public class Ack
    {
        /// <summary>
        /// 是否成功
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// 状态编号
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// 状态信息
        /// </summary>
        public string StatusMessage { get; set; }

        public Ack()
        {
            IsSuccess = true;
            StatusMessage = string.Empty;
        }
    }
}
