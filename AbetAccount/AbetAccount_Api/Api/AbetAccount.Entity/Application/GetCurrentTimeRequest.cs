using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Entity.Application
{
    /// <summary>
    /// 获取当前时间请求
    /// </summary>
    public class GetCurrentTimeRequest
    {
    }

    /// <summary>
    /// 获取当前时间响应
    /// </summary>
    public class GetCurrentTimeResponse
    {
        /// <summary>
        /// 时间毫秒数
        /// </summary>
        public long Time { get; set; }
    }
}
