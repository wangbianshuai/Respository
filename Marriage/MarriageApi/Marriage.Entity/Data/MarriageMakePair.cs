using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 相亲配对计算信息表
    /// </summary>
    [TableProperty(Name = "t_MarriageMakePair", PrimaryKey = "MarkPairId")]
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
}