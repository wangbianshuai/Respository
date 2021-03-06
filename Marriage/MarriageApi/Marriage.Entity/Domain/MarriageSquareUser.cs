﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    public class MarriageSquareUser
    {
        /// <summary> 
        /// 相亲用户ID
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 微信昵称
        /// </summary> 
        public string NickName { get; set; }
        /// <summary> 
        /// 微信用户头像
        /// </summary> 
        public string HeadImgUrl { get; set; }
        /// <summary> 
        /// 个性签名
        /// </summary> 
        public string Remark { get; set; }
        /// <summary>
        /// 年龄
        /// </summary>
        public int Age { get; set; }
        /// <summary> 
        /// 玫瑰数量
        /// </summary> 
        public int RoseCount { get; set; }
        /// <summary>
        /// 收到玫瑰数
        /// </summary>
        public int RoseCount2 { get; set; }

    }
}
