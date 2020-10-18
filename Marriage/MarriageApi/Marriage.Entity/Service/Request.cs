using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service
{
    /// <summary>
    /// 请求接口
    /// </summary>
    public interface IRequest
    {
        /// <summary>
        /// 获取到的凭证
        /// </summary>
        string AccessToken { get; set; }

        /// <summary>
        /// 服务地址
        /// </summary>
        string Url { get; set; }
    }

    /// <summary>
    /// 请求基类
    /// </summary>

    public class Request : IRequest
    {
        /// <summary>
        /// 获取到的凭证
        /// </summary>
        public string AccessToken { get; set; }
        /// <summary>
        /// 服务地址
        /// </summary>
        public string Url { get; set; }
    }
}

