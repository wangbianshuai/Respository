using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_MarriageRecord", PrimaryKey = "RecordId")]
    [RequestMethod(IsDelete = false)]
    public class MarriageRecord : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid RecordId { get; set; }
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
        /// 安装相亲Id
        /// </summary> 
        public Guid ArrangeMarriageId { get; set; }
        /// <summary> 
        /// 相亲时间
        /// </summary> 
        public DateTime MarriageDate { get; set; }
        /// <summary> 
        /// 相亲情况
        /// </summary> 
        public string MarriageContent { get; set; }
        /// <summary> 
        /// 男生得分
        /// </summary> 
        public int ManScore { get; set; }
        /// <summary> 
        /// 男生得分点说明
        /// </summary> 
        public string ManScoreRemark { get; set; }
        /// <summary> 
        /// 男生失分点说明
        /// </summary> 
        public string ManNoScoreRemark { get; set; }
        /// <summary> 
        /// 女生得分
        /// </summary> 
        public int WomanScore { get; set; }
        /// <summary> 
        /// 女生得分点说明
        /// </summary> 
        public string WomanScoreRemark { get; set; }
        /// <summary> 
        /// 女生失分点说明
        /// </summary> 
        public string WomanNoScoreRemark { get; set; }
        /// <summary> 
        /// 状态：1：有意向，2：无意向，3：先了解
        /// </summary> 
        public byte Status { get; set; }
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

    [TableProperty(Name = "v_MarriageRecord", PrimaryKey = "RecordId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewMarriageRecord : MarriageRecord
    {
        public string StatusName { get; set; }
    }
}