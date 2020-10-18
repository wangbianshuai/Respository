using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_SendTemplateMessage", PrimaryKey = "SendTemplateMessageId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class SendTemplateMessage : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid SendTemplateMessageId { get; set; }
        /// <summary> 
        /// App账号ID
        /// </summary> 
        public Guid AppAccountId { get; set; }
        /// <summary> 
        /// 模板消息ID
        /// </summary> 
        public string TemplateId { get; set; }
        /// <summary> 
        /// 结果响应
        /// </summary> 
        public string ResultResponse { get; set; }
        /// <summary> 
        /// 用户标签Ids,以逗号隔开
        /// </summary> 
        public string UserTagIds { get; set; }
        /// <summary> 
        /// 模板内容字体颜色，不填默认为黑色
        /// </summary> 
        public string Color { get; set; }
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

    [TableProperty(Name = "v_SendTemplateMessage", PrimaryKey = "SendTemplateMessageId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewSendTemplateMessage : SendTemplateMessage
    {

        /// <summary>
        /// 微信模板标题
        /// </summary>
        public string WeChatTemplateName { get; set; }
        /// <summary>
        /// 粉丝标签
        /// </summary>
        public string UserTagNames { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public string StatusName { get; set; }
    }

    [TableProperty(Name = "t_SendTemplateMessageProperty", PrimaryKey = "Id")]
    public class SendTemplateMessageProperty : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// 发送模板消息ID
        /// </summary> 
        public Guid SendTemplateMessageId { get; set; }
        /// <summary> 
        /// 属性名
        /// </summary> 
        public string PropertyName { get; set; }
        /// <summary> 
        /// 值
        /// </summary> 
        public string Value { get; set; }
        /// <summary> 
        /// 模板内容字体颜色，不填默认为黑色
        /// </summary> 
        public string Color { get; set; }
    }
}