using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    public class MarriageMakePair2
    {
        /// <summary>
        /// 男方
        /// </summary>
        public Guid ManUserId { get; set; }
        /// <summary>
        /// 女方
        /// </summary>
        public Guid WomanUserId { get; set; }
    }
}
