using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// App账号
    /// </summary>
    [TableProperty(Name = "t_AppAccount", PrimaryKey = "AppAccountId")]
    public class AppAccount : EntityModel, IEntity
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
        /// 公司名称
        /// </summary> 
        public string CompanyName { get; set; }
        /// <summary> 
        /// Logo图片地址
        /// </summary> 
        public string LogoImageUrl { get; set; }
        /// <summary>
        /// Logo图片显示宽度
        /// </summary>
        public int LogoImageDisplayWidth { get; set; }
        /// <summary>
        /// 站点标题
        /// </summary>
        public string SiteTitle { get; set; }
        /// <summary> 
        /// 地址
        /// </summary> 
        public string Address { get; set; }
        /// <summary> 
        /// 联系人
        /// </summary> 
        public string Linkman { get; set; }
        /// <summary> 
        /// 手机
        /// </summary> 
        public string Phone { get; set; }
        /// <summary> 
        /// 微信AppId
        /// </summary> 
        public string AppId { get; set; }
        /// <summary> 
        /// 微信Secret
        /// </summary> 
        public string Secret { get; set; }
        /// <summary> 
        /// 状态：1：正常，2：关闭
        /// </summary> 
        public byte Status { get; set; }
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
