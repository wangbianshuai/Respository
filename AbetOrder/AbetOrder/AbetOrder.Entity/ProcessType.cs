using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_ProcessType", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class ProcessType : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double FeeValue { get; set; }
        public byte UnitType { get; set; }
        public string Remark { get; set; }
        public byte IsDelete { get; set; }
        public DateTime CreateDate { get; set; }
        public string RowVersion { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<ProcessType>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<ProcessType>("Id=@Id and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<ProcessType>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_ProcessType", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class ViewProcessType : ProcessType
    {
        public string UnitTypeName { get; set; }
    }
}
