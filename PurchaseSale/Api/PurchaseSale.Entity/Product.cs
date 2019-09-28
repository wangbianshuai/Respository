using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccess.Entity;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "t_Product", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class Product : EntityModel, IEntity
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid Id { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 商品编号
        /// </summary>
        public string ProductCode { get; set; }
        /// <summary>
        /// 商品条形码
        /// </summary>
        public string ProductBarCode { get; set; }
        /// <summary>
        /// 商品类型
        /// </summary>
        public Guid ProductTypeId { get; set; }
        /// <summary>
        /// 商品品牌
        /// </summary>
        public Guid ProductBrandId { get; set; }
        /// <summary>
        /// 型号
        /// </summary>
        public string Model { get; set; }
        /// <summary>
        /// 规格
        /// </summary>
        public string Spec { get; set; }
        /// <summary>
        /// 计量单位
        /// </summary>
        public string Unit { get; set; }
        /// <summary>
        /// 库存
        /// </summary>
        public float InitStock { get; set; }
        /// <summary>
        /// 采购价
        /// </summary>
        public decimal BidPrice { get; set; }
        /// <summary>
        /// 销售价
        /// </summary>
        public decimal SillingPrice { get; set; }
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
            validateList.Add(this.ValidateExists<Product>("IsDelete=0 and Name=@Name", "对不起，该商品名称已存在！"));

            validateList.Add(this.ValidateExists<Product>("IsDelete=0 and ProductCode=@ProductCode", "对不起，该商品编号已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Product>("Id=@Id and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<Product>("IsDelete=0 and Name=@Name", "对不起，该商品名称已存在！"));

            validateList.Add(this.ValidateExists<Product>("Id=@Id and ProductCode=@ProductCode", "true"));
            validateList.Add(this.ValidateExists<Product>("IsDelete=0 and ProductCode=@ProductCode", "对不起，该商品编号已存在！"));
        }
    }

    [TableProperty(Name = "v_Product", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewProduct : Product
    {
        public string ProductTypeName { get; set; }
        public string ProductBrandName { get; set; }
        public float CurrentStock { get; set; }
    }
}