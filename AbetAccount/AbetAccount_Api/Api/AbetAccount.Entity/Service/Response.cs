using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Entity.Service
{
    /// <summary>
    /// 响应接口
    /// </summary>
    public interface IResponse
    {
        /// <summary>
        /// 返回码
        /// </summary>
        int ErrCode { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        string ErrMsg { get; set; }

        /// <summary>
        /// 结果
        /// </summary>
        bool result { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        string errMessage { get; set; }
    }

    /// <summary>
    /// 响应基类
    /// </summary>
    public class Response : IResponse
    {
        /// <summary>
        /// 返回码
        /// </summary>
        public int ErrCode { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string ErrMsg { get; set; }

        /// <summary>
        /// 结果
        /// </summary>
        public bool result { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string errMessage { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public Response()
        {
            result = true;
        }
    }
}
