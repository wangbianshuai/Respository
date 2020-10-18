using System;
using System.Collections.Generic;
using System.Text;

namespace Resources.Entity.Application
{
    /// <summary>
    /// 请求接口
    /// </summary>
    public interface IRequest
    {
        /// <summary>
        /// IP地址
        /// </summary>
        string IpAddress { get; set; }
        /// <summary>
        /// AppId
        /// </summary>
        string AppId { get; set; }
    }

    /// <summary>
    /// 请求基类
    /// </summary>
    public class Request : IRequest
    {
        /// <summary>
        /// IP地址
        /// </summary>
        public string IpAddress { get; set; }

        /// <summary>
        /// AppId
        /// </summary>
        public string AppId { get; set; }
    }
}
