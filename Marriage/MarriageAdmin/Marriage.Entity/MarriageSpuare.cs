using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_MarriageSpuare", PrimaryKey = "MarriageSpuareId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class MarriageSpuare : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarriageSpuareId { get; set; }
        /// <summary> 
        /// 相亲用户ID
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 对方用户ID
        /// </summary> 
        public Guid OtherSideUserId { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime UpdateDate { get; set; }
        /// <summary> 
        /// 玫瑰数量
        /// </summary> 
        public int RoseCount { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }

    [TableProperty(Name = "v_MarriageSpuare", PrimaryKey = "MarriageSpuareId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewMarriageSpuare : MarriageSpuare
    {
        public string UserName { get; set; }
        public byte UserSex { get; set; }
        public string UserSexName { get; set; }
        public string OtherSideUserName { get; set; }
        public byte OtherSideUserSex { get; set; }
        public string OtherSideUserSexName { get; set; }
    }

    [TableProperty(Name = "v_MarriageSpuare2")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewMarriageSpuare2 : EntityModel, IEntity
    {
        public Guid MarriageSpuareId { get; set; }
        public Guid ManUserId { get; set; }
        public string ManUserName { get; set; }
        public DateTime CreateDate { get; set; }
        public Guid ManMatchmakerId { get; set; }
        public int RoseCount { get; set; }
        public DateTime UpdateDate { get; set; }
        public DateTime CreateDate2 { get; set; }
        public int RoseCount2 { get; set; }
        public DateTime UpdateDate2 { get; set; }
        public Guid WomanUserId { get; set; }
        public Guid WomanMatchmakerId { get; set; }
        public string WomanUserName { get; set; }
        public int ArrangeId { get; set; }
        public string ArrangeLabel { get; set; }
        public string ManMatchmakerName { get; set; }
        public string WomanMatchmakerName { get; set; }
        public DateTime UpdateDate3 { get; set; }
    }
}