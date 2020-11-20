using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageFee
{
    /// <summary>
    /// 获取相亲费用请求
    /// </summary>
    public class GetMarriageFeeRequest : Request, IRequest
    {
        /// <summary>
        /// 相亲安排Id
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
    }

    /// <summary>
    /// 获取相亲费用响应
    /// </summary>
    public class GetMarriageFeeResponse : Response, IResponse
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
        /// <summary>
        /// 男方红娘
        /// </summary>
        public string ManMatchmakerName { get; set; }
        /// <summary>
        /// 男方红娘金额
        /// </summary>
        public Nullable<decimal> ManAmount { get; set; }
        /// <summary>
        /// 男方平台金额
        /// </summary>
        public Nullable<decimal> ManAppAmount { get; set; }
        /// <summary>
        /// 男方备注
        /// </summary>
        public string ManRemark { get; set; }
        /// <summary>
        /// 女方红娘
        /// </summary>
        public string WomanMatchmakerName { get; set; }
        /// <summary>
        /// 女方红娘金额
        /// </summary>
        public Nullable<decimal> WomanAmount { get; set; }
        /// <summary>
        /// 女方平台金额
        /// </summary>
        public Nullable<decimal> WomanAppAmount { get; set; }
        /// <summary>
        /// 女方备注
        /// </summary>
        public string WomanRemark { get; set; }
        /// <summary>
        /// 平台红娘
        /// </summary>
        public string AppMatchmakerName { get; set; }
        /// <summary>
        /// 平台红娘金额
        /// </summary>
        public Nullable<decimal> AppAmount { get; set; }
        /// <summary>
        /// 平台方平台金额
        /// </summary>
        public Nullable<decimal> AppAppAmount { get; set; }
        /// <summary>
        /// 平台方备注
        /// </summary>
        public string AppRemark { get; set; }
        /// <summary>
        /// 总金额
        /// </summary>
        public Nullable<decimal> Amount { get; set; }
        /// <summary>
        /// 费用日期
        /// </summary>
        public string FeeDate { get; set; }
    }

}
