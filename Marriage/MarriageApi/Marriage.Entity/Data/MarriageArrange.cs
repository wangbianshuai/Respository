using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 安排相亲信息表
    /// </summary>
    [TableProperty(Name = "t_MarriageArrange", PrimaryKey = "MarriageArrangeId")]
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
        /// 女生不同意愿因
        /// </summary> 
        public string NoWomanAgreeRemark { get; set; }
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
}