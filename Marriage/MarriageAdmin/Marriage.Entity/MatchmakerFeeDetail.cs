using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_MatchmakerFeeDetail", PrimaryKey = "DetailId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
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

    [TableProperty(Name = "v_MatchmakerFeeDetail", PrimaryKey = "DetailId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewMatchmakerFeeDetail : MatchmakerFeeDetail
    {
        public int ArrangeId { get; set; }

        public string ManName { get; set; }

        public string WomanName { get; set; }

        public string MatchmakerName { get; set; }

        public byte IsAppMatchmaker { get; set; }
    }
}