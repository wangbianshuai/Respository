using OpenDataAccessCore.Entity;
using System; 
using System.Collections.Generic; 
using System.Linq;  
using System.Text; 
 
namespace Marriage.Entity
{
    [TableProperty(Name = "t_ArrangeMarriage", PrimaryKey = "ArrangeMarriageId")]
    [RequestMethod(IsDelete = false)]
    public class MarriageArrange : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarriageArrangeId { get; set; }
        /// <summary> 
        /// 男生ID
        /// </summary> 
        public Guid ManUserId { get; set; }
        /// <summary> 
        /// 女生ID
        /// </summary> 
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
        /// 相亲时间
        /// </summary> 
        public DateTime MarriageDate { get; set; }
        /// <summary> 
        /// 相亲地点
        /// </summary> 
        public string MarriageAddress { get; set; }
        /// <summary> 
        /// 相亲情况
        /// </summary> 
        public string MarriageContent { get; set; }
        /// <summary> 
        /// 状态：0：待相亲，1：有意向，2：无意向，3：牵手成功，4：订婚，5：结婚，6：分手，7：取消
        /// </summary> 
        public byte Status { get; set; }
        /// <summary> 
        /// 男生是否同意
        /// </summary> 
        public byte IsManAgree { get; set; }
        /// <summary> 
        /// 男生不同意原因
        /// </summary> 
        public string NoManAgreeRemark { get; set; }
        /// <summary> 
        /// 女生是否同意
        /// </summary> 
        public byte IsWomanAgree { get; set; }
        /// <summary> 
        /// 女生不同意原因
        /// </summary> 
        public string NoWomanAgreeRemark { get; set; }
        /// <summary>
        /// 取消原因
        /// </summary>
        public string CancelReason { get; set; }
        /// <summary> 
        /// 费用日期
        /// </summary> 
        public DateTime FeeDate { get; set; }
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
    }

    [TableProperty(Name = "v_MarriageArrange", PrimaryKey = "MarriageArrangeId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewMarriageArrange : MarriageArrange
    {
        public string StatusName { get; set; }
    }
}