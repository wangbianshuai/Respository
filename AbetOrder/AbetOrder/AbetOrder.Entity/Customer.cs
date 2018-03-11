using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_Customer", PrimaryKey = "Id")]
    public class Customer : EntityModel, IEntity
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
        /// 公司名
        /// </summary>
        public string CompanyName { get; set; }
        /// <summary>
        /// 联系人
        /// </summary>
        public string Linkman { get; set; }
        /// <summary>
        /// 手机
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// 电话
        /// </summary>
        public string Telephone { get; set; }
        /// <summary>
        /// 传真
        /// </summary>
        public string Tax { get; set; }
        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// <summary> 
        /// 逻辑删除，1：删除,0:正常
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Customer>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Customer>("Id=@Id and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<Customer>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_Customer", PrimaryKey = "Id")]
    public class ViewCustomer : Customer
    {
        public long RowVersion { get; set; }
    }
}
