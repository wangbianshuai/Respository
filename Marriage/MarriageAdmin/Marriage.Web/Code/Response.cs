using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Web.Code
{
    /// <summary>
    /// 响应基类
    /// </summary>
    public class Response
    {
        /// <summary>
        /// 应答
        /// </summary>
        public Ack Ack { get; set; }

        /// <summary>
        /// Token
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public Response()
        {
            Ack = new Ack();
        }
    }

    /// <summary>
    /// 应答
    /// </summary>
    public class Ack
    {
        /// <summary>
        /// 是否成功
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// 编号
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        /// 信息
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public Ack()
        {
            IsSuccess = true;
            Message = string.Empty;
        }
    }
}
