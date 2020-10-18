using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 微信消息模板
    /// </summary>
    [TableProperty(Name = "t_WeChatTemplate", PrimaryKey = "TemplateId")]
    public class WeChatTemplate : EntityModel, IEntity
    {
        /// <summary> 
        /// 微信模板Id
        /// </summary> 
        public string TemplateId { get; set; }
        /// <summary> 
        /// App账号ID
        /// </summary> 
        public Guid AppAccountId { get; set; }

        /// <summary> 
        /// 微信模板标题
        /// </summary> 
        public string Title { get; set; }
        /// <summary> 
        /// 模板所属行业的一级行业
        /// </summary> 
        public string PrimaryIndustry { get; set; }
        /// <summary> 
        /// 模板所属行业的二级行业
        /// </summary> 
        public string DeputyIndustry { get; set; }
        /// <summary> 
        /// 模板内容
        /// </summary> 
        public string Content { get; set; }
        /// <summary> 
        /// 模板示例
        /// </summary> 
        public string Example { get; set; }
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
