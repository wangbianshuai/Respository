using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 直播用户状态
    /// </summary>
    [TableProperty(Name = "t_LiveUserStatus", PrimaryKey = "UserStatusId")]
    public class LiveUserStatus : EntityModel, IEntity
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid UserStatusId { get; set; }
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary> 
        /// 用户ID
        /// </summary> 
        public string UserId { get; set; }
        /// <summary> 
        /// 是否禁言
        /// </summary> 
        public byte IsBanned { get; set; }
        /// <summary> 
        /// 是否被踢出
        /// </summary> 
        public byte IsRemove { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }
}