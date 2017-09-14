using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EntityDataService.Entity;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_GuidDataTable", PrimaryKey = "DataId")]
    public class GuidDataTable : EntityModel, IEntity
    {
        public Guid DataId { get; set; }
        public Guid GuidValue1 { get; set; }
        public Guid GuidValue2 { get; set; }
        public Guid GuidValue3 { get; set; }
        public Guid GuidValue4 { get; set; }
        public Guid GuidValue5 { get; set; }
        public Guid GuidValue6 { get; set; }
        public Guid GuidValue7 { get; set; }
        public Guid GuidValue8 { get; set; }
        public Guid GuidValue9 { get; set; }
        public Guid GuidValue10 { get; set; }
        public Guid GuidValue11 { get; set; }
        public Guid GuidValue12 { get; set; }
        public Guid GuidValue13 { get; set; }
        public Guid GuidValue14 { get; set; }
        public Guid GuidValue15 { get; set; }
        public Guid GuidValue16 { get; set; }
        public Guid GuidValue17 { get; set; }
        public Guid GuidValue18 { get; set; }
        public Guid GuidValue19 { get; set; }
        public Guid GuidValue20 { get; set; }
    }
}