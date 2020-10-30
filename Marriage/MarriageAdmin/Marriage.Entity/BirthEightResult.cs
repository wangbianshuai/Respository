using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_BirthEightResult", PrimaryKey = "ResultId")]
    [RequestMethod(IsDelete = false)]
    public class BirthEightResult : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ResultId { get; set; }
        /// <summary> 
        /// 男生ID
        /// </summary> 
        public Guid ManUserId { get; set; }
        /// <summary> 
        /// 女生ID
        /// </summary> 
        public Guid WomanUserId { get; set; }
        /// <summary> 
        /// 匹配结果
        /// </summary> 
        public string Content { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
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
        /// <summary> 
        /// 更新人
        /// </summary> 
        public Guid UpdateUser { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime UpdateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }


    [TableProperty(Name = "v_BirthEightResult", PrimaryKey = "ResultId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewBirthEightResult : BirthEightResult
    {
    }
}