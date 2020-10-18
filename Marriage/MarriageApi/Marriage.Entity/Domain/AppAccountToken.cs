using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// App账户访问Token
    /// </summary>
    public class AppAccountToken
    { 
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid TokenId { get; set; }
        /// <summary> 
        /// App账户ID
        /// </summary> 
        public Guid AppAccountId { get; set; }
        /// <summary> 
        /// 微信access token
        /// </summary> 
        public string AccessToken { get; set; }
        /// <summary> 
        /// 微信token有效时间（秒）
        /// </summary> 
        public int ExpiresIn { get; set; }
        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdateDate { get; set; }
    }
}
