using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_AppAccount", PrimaryKey = "AppAccountId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
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

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<AppAccount>("IsDelete=0 and AccessPathName=@AccessPathName", "对不起，后台访问路径名已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<AppAccount>("AppAccountId=@AppAccountId and AccessPathName=@AccessPathName", "true"));
            validateList.Add(this.ValidateExists<AppAccount>("IsDelete=0 and AccessPathName=@AccessPathName", "对不起，后台访问路径名已存在！"));
        }
    }

    [TableProperty(Name = "v_AppAccount", PrimaryKey = "AppAccountId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewAppAccount : AppAccount
    {
        /// <summary>
        /// 状态
        /// </summary>
        public string StatusName { get; set; }
    }

    public class AppAcountInfo
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid AppAccountId { get; set; }
        /// <summary>
        /// 站点标题
        /// </summary>
        public string SiteTitle { get; set; }
    }
}