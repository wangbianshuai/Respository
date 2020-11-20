using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 红娘中介费明细表
    /// </summary>
    [TableProperty(Name = "t_MatchmakerFeeDetail", PrimaryKey = "DetailId")]
    public class MatchmakerFeeDetail : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DetailId { get; set; }
        /// <summary> 
        /// 红娘Id
        /// </summary> 
        public Guid MatchmakerId { get; set; }
        /// <summary>
        /// 红娘类型，1：男方，2：女方，3：平台
        /// </summary>
        public byte MatchmakerType { get; set; }
        /// <summary> 
        /// 相亲安排Id
        /// </summary> 
        public Guid MarriageArrangeId { get; set; }
        /// <summary> 
        /// 费用日期
        /// </summary> 
        public DateTime FeeDate { get; set; }
        /// <summary> 
        /// 金额
        /// </summary> 
        public decimal Amount { get; set; }
        /// <summary> 
        /// 平台中介费
        /// </summary> 
        public decimal AppAmount { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// <summary> 
        /// 是否删除
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建人
        /// </summary> 
        public Guid CreateUser { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }
}