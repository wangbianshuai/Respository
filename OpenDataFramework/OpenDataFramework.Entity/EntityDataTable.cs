using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EntityDataService.Entity;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_DataTable", PrimaryKey = "DataId")]
    public class EntityDataTable : EntityModel, IEntity
    {
        public Guid DataId { get; set; }
        public Guid EntityId { get; set; }
        public byte IsDelete { get; set; }
        public byte DataStatus { get; set; }
        public Guid CreateUser { get; set; }
        public DateTime CreateDate { get; set; }
        public Guid ModifyUser { get; set; }
        public DateTime ModifyDate { get; set; }
    }
}