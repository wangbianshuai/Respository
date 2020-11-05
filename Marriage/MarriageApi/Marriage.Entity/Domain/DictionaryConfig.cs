using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 键值配置
    /// </summary>
    public class DictionaryConfig
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
    }
}
