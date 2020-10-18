using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// App账户访问Token
    /// </summary>
    [TableProperty(Name = "t_AppAccountToken", PrimaryKey = "TokenId")]
    public class AppAccountToken : EntityModel, IEntity
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
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }
}
