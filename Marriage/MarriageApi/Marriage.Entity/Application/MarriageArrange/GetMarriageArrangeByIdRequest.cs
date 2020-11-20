using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageArrange
{
    /// <summary>
    /// 获取相亲安排信息请求
    /// </summary>
    public class GetMarriageArrangeByIdRequest : Request, IRequest
    {
        /// <summary>
        /// 获取相亲安排
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
    }

    /// <summary>
    /// 获取相亲安排信息响应
    /// </summary>
    public class GetMarriageArrangeByIdResponse : Response, IResponse
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarriageArrangeId { get; set; }
        /// <summary> 
        /// 相亲时间
        /// </summary> 
        public string MarriageDate { get; set; }
        /// <summary> 
        /// 相亲地点
        /// </summary> 
        public string MarriageAddress { get; set; }
        /// <summary> 
        /// 相亲情况
        /// </summary> 
        public string MarriageContent { get; set; }
        /// <summary>
        /// 平台红娘
        /// </summary>
        public string AppMatchmakerName { get; set; }
        /// <summary>
        /// 男方
        /// </summary>
        public string ManUserName { get; set; }
        /// <summary>
        /// 女方
        /// </summary>
        public string WomanUserName { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }
}
