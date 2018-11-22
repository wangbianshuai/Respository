using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_ProcessItem", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class ProcessItem : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        /// <summary> 
        /// 显示顺序
        /// </summary> 
        public int DisplayIndex { get; set; }
        public byte IsDelete { get; set; }
        public DateTime CreateDate { get; set; }
        public string RowVersion { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<ProcessItem>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<ProcessItem>("Id=@Id and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<ProcessItem>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_ProcessItem", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class ViewProcessItem : ProcessItem
    {
    }
}
