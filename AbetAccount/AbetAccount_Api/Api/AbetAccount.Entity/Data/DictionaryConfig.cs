using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Entity.Data
{
    /// <summary>
    /// 键值配置
    /// </summary>
    [TableProperty(Name = "t_DictionaryConfig", PrimaryKey = "DictionaryConfigId")]
    public class DictionaryConfig : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DictionaryConfigId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 值
        /// </summary> 
        public string Value { get; set; }
        /// <summary> 
        /// 类型名
        /// </summary> 
        public string TypeName { get; set; }
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
}
