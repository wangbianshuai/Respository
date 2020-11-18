using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_MarriageMakePair", PrimaryKey = "MarkPairId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class MarriageMakePair : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarkPairId { get; set; }
        /// <summary> 
        /// 相亲用户Id
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 对方用户Id
        /// </summary> 
        public Guid OtherSideUserId { get; set; }
        /// <summary> 
        /// 匹配度（%）
        /// </summary> 
        public decimal PercentValue { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }

    [TableProperty(Name = "t_MarriageMakePairDetail", PrimaryKey = "DetailId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class MarriageMakePairDetail : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DetailId { get; set; }
        /// <summary> 
        /// 配对明细Id
        /// </summary> 
        public Guid MarkPairId { get; set; }
        /// <summary> 
        /// 条件类型Id
        /// </summary> 
        public Guid ConditionTypeId { get; set; }
        /// <summary> 
        /// 条件类型
        /// </summary> 
        public string ConditionTypeNmae { get; set; }
        /// <summary> 
        /// 条件选项Id
        /// </summary> 
        public Guid ConditionItemId { get; set; }
        /// <summary> 
        /// 条件标题
        /// </summary> 
        public string ConditionItemTitle { get; set; }
        /// <summary> 
        /// 自己选择值
        /// </summary> 
        public string SelfSelectValue { get; set; }
        /// <summary> 
        /// 对方选择值
        /// </summary> 
        public string OtherSideSelectValue { get; set; }
        /// <summary> 
        /// 匹配度（%）
        /// </summary> 
        public decimal PercentValue { get; set; }
    }

    [TableProperty(Name = "v_MarriageMakePair", PrimaryKey = "MarkPairId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class ViewMarriageMakePair : EntityModel, IEntity
    {
        public Guid MarkPairId { get; set; }
        public Guid UserId { get; set; }
        public Guid OtherSideUserId { get; set; }
        public string PercentValue { get; set; }
        public DateTime CreateDate { get; set; }
        public string UserName { get; set; }
        public byte UserSex { get; set; }
        public string UserSexName { get; set; }
        public string OtherSideUserName { get; set; }
        public byte OtherSideUserSex { get; set; }
        public string OtherSideUserSexName { get; set; }
    }

    [TableProperty(Name = "v_MarriageMakePair2", PrimaryKey = "MarkPairId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class MarriageMakePair2 : EntityModel, IEntity
    {
        public Guid MarkPairId { get; set; }
        public Guid ManUserId { get; set; }
        public string ManUserName { get; set; }
        public DateTime CreateDate { get; set; }
        public Guid ManMatchmakerId { get; set; }
        public string PercentValue { get; set; }
        public DateTime CreateDate2 { get; set; }
        public string PercentValue2 { get; set; }
        public Guid WomanUserId { get; set; }
        public Guid WomanMatchmakerId { get; set; }
        public string WomanUserName { get; set; }
        public int ArrangeId { get; set; }
        public string ArrangeLabel { get; set; }
        public string ManMatchmakerName { get; set; }
        public string WomanMatchmakerName { get; set; }
        public DateTime CreateDate3 { get; set; }
        public string PercentValue3 { get; set; }
    }
}