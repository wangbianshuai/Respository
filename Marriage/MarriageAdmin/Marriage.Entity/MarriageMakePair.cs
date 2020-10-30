using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_MarriageMakePair", PrimaryKey = "MarkPairId")]
    [RequestMethod(IsDelete = false)]
    public class MarriageMakePair : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarkPairId { get; set; }
        /// <summary> 
        /// 用户
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 配对符合条件人数，大于30%的人数
        /// </summary> 
        public int UserCount { get; set; }
        /// <summary> 
        /// 更新人
        /// </summary> 
        public Guid CreateUser { get; set; }
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
        /// 配对Id
        /// </summary> 
        public Guid MarkPairId { get; set; }
        /// <summary> 
        /// 用户Id
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 匹配度（%）
        /// </summary> 
        public decimal PercentValue { get; set; }
    }

    [TableProperty(Name = "t_MarriageMakePairRecord", PrimaryKey = "DetailId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class MarriageMakePairRecord : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DetailId { get; set; }
        /// <summary> 
        /// 配对明细Id
        /// </summary> 
        public Guid MakePairDetailId { get; set; }
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
        public string ConditionItemTile { get; set; }
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
}