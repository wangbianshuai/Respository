﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_MarriageUserPhoto", PrimaryKey = "PhotoId")]
    [RequestMethod(IsDelete = false)]
    public class MarriageUserPhoto : EntityModel, IEntity
    {
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
    }

    [TableProperty(Name = "v_MarriageUserPhoto", PrimaryKey = "PhotoId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewMarriageUserPhoto : MarriageUserPhoto
    {
    }
}