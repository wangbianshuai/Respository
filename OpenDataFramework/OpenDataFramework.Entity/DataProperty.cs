using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EntityDataService.Entity;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_Property", PrimaryKey = "PropertyId")]
    public class DataProperty : EntityModel, IEntity
    {
        public Guid PropertyId { get; set; }
        public Guid EntityId { get; set; }
        public string PropertyName { get; set; }
        public string TableName { get; set; }
        public string FieldName { get; set; }
        public string DataType { get; set; }
        public int MaxLength { get; set; }
        public byte IsIndex { get; set; }
        public byte IsNullable { get; set; }
    }
}