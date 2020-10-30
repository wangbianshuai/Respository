using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_MarriageSccuess", PrimaryKey = "SccuessId")]
    [RequestMethod(IsDelete = false)]
    public class MarriageSccuess : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid SccuessId { get; set; }
        /// <summary> 
        /// 男生ID
        /// </summary> 
        public Guid ManUserId { get; set; }
        public Guid WomanUserId { get; set; }
        /// <summary> 
        /// 男生红娘
        /// </summary> 
        public Guid ManMatchmakerId { get; set; }
        /// <summary> 
        /// 女生红娘
        /// </summary> 
        public Guid WomanMatchmakerId { get; set; }
        /// <summary> 
        /// 平台红娘
        /// </summary> 
        public Guid AppMatchmakerId { get; set; }
        /// <summary> 
        /// 相关记录Id,相亲成功的那次记录
        /// </summary> 
        public Guid MarriageRecordId { get; set; }
        /// <summary> 
        /// 费用日期
        /// </summary> 
        public DateTime FeeDate { get; set; }
        /// <summary> 
        /// 相亲成功日期
        /// </summary> 
        public DateTime SuccessDate { get; set; }
        /// <summary> 
        /// 订婚日期
        /// </summary> 
        public DateTime BookMarryDate { get; set; }
        /// <summary> 
        /// 结婚日期
        /// </summary> 
        public DateTime MarryDate { get; set; }
        /// <summary> 
        /// 分手日期
        /// </summary> 
        public DateTime BreakUpDate { get; set; }
        /// <summary> 
        /// 状态：1：相亲成功，2：订婚，3：结婚，4：分手
        /// </summary> 
        public byte Status { get; set; }
        /// <summary> 
        /// 分手原因
        /// </summary> 
        public string BreakUpReason { get; set; }
        /// <summary> 
        /// 相亲总费用
        /// </summary> 
        public decimal Amount { get; set; }
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
        /// 更新人
        /// </summary> 
        public Guid UpdateUser { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime UpdateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }

    [TableProperty(Name = "v_MarriageSccuess", PrimaryKey = "SccuessId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewMarriageSccuess : MarriageSccuess
    {
        public string StatusName { get; set; }
    }
}