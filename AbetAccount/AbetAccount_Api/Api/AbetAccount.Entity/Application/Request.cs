using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Entity.Application
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
        /// <summary>
        /// 登录用户Id
        /// </summary>
        string LoginUserId { get; set; }
        /// <summary>
        /// 引用地址
        /// </summary>
        string Referer { get; set; }
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
        /// <summary>
        /// 登录用户Id
        /// </summary>
        public string LoginUserId { get; set; }
        /// <summary>
        /// 引用地址
        /// </summary>
        public string Referer { get; set; }
    }

    /// <summary>
    /// 排序
    /// </summary>
    public class OrderByType
    {
        /// <summary>
        /// 字段名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 类型，asc 或 desc
        /// </summary>
        public string Type { get; set; }
    }
}
