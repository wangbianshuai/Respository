using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 直播用户状态
    /// </summary>
    public class LiveUserStatus
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
        /// 状态
        /// </summary>
        public byte Status { get; set; }
        /// <summary>
        /// 状态类型
        /// </summary>
        public byte StatusType { get; set; }
    }
}
