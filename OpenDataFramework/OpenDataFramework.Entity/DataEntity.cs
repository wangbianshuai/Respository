using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EntityDataService.Entity;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_Entity", PrimaryKey = "EntityId")]
    public class DataEntity : EntityModel, IEntity
    {
        public Guid EntityId { get; set; }
        public string EntityName { get; set; }
        public byte IsDelete { get; set; }
        public string KeyNames { get; set; }
        public DateTime CreateDate { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<DataEntity>("IsDelete=0 and EntityName=@EntityName", "对不起，该实体名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<DataEntity>("EntityId=@EntityId and EntityName=@EntityName", "true"));
            validateList.Add(this.ValidateExists<DataEntity>("IsDelete=0 and EntityName=@EntityName", "对不起，该实体名称已存在！"));
        }
    }
}