using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// App账号
    /// </summary>
    public class AppAccount
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid AppAccountId { get; set; }
        /// <summary> 
        /// 后台访问路径名，建议用字母集合
        /// </summary> 
        public string AccessPathName { get; set; }
        /// <summary> 
        /// 微信AppId
        /// </summary> 
        public string AppId { get; set; }
        /// <summary> 
        /// 微信Secret
        /// </summary> 
        public string Secret { get; set; }
    }
}
