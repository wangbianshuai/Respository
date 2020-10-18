using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application
{
    /// <summary>
    /// 响应接口
    /// </summary>
    public interface IResponse
    {
        /// <summary>
        /// 应答
        /// </summary>
        Ack Ack { get; set; }

        /// <summary>
        /// Token
        /// </summary>
        string Token { get; set; }
    }

    /// <summary>
    /// 响应基类
    /// </summary>
    public class Response : IResponse
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

    /// <summary>
    /// 分页信息
    /// </summary>
    public class PageInfo
    {
        /// <summary>
        /// 分页索引，从1开始
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 分页大小
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// 页数
        /// </summary>
        public int PageCount { get; set; }
        /// <summary>
        /// 总记录数
        /// </summary>
        public int TotalCount { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalCount"></param>
        public PageInfo(int pageIndex, int pageSize, int totalCount)
        {
            this.PageIndex = pageIndex;
            this.PageSize = pageSize;
            this.TotalCount = totalCount;

            if (totalCount % pageSize == 0) this.PageCount = totalCount / pageSize;
            else this.PageCount = totalCount / pageSize + 1;

            this.PageIndex = pageIndex > this.PageCount ? this.PageCount : pageIndex;
        }
    }
}
