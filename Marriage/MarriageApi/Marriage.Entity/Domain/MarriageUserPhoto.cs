using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    ///  相亲用户生活照信息表
    /// </summary>
    public class MarriageUserPhoto {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid PhotoId { get; set; }
        /// <summary> 
        /// 相亲用户ID
        /// </summary> 
        public Guid MarriageUserId { get; set; }
        /// <summary> 
        /// 照片地址
        /// </summary> 
        public string PhotoUrl { get; set; }
    }
}
