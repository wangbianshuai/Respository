using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EntityDataService.Entity;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_ExpandStringTable", PrimaryKey = "DataId")]
    public class ExpandStringTable : EntityModel, IEntity
    {
        public Guid DataId { get; set; }
        public string Nvarchar2000Value1 { get; set; }
        public string Nvarchar2000Value2 { get; set; }
        public string Nvarchar2000Value3 { get; set; }
        public string Nvarchar2000Value4 { get; set; }
        public string Nvarchar2000Value5 { get; set; }
        public string Nvarchar2000Value6 { get; set; }
        public string Nvarchar2000Value7 { get; set; }
        public string Nvarchar2000Value8 { get; set; }
        public string Nvarchar2000Value9 { get; set; }
        public string Nvarchar2000Value10 { get; set; }
        public string Nvarchar4000Value1 { get; set; }
        public string Nvarchar4000Value2 { get; set; }
        public string Nvarchar4000Value3 { get; set; }
        public string Nvarchar4000Value4 { get; set; }
        public string Nvarchar4000Value5 { get; set; }
        public string Nvarchar4000Value6 { get; set; }
        public string Nvarchar4000Value7 { get; set; }
        public string Nvarchar4000Value8 { get; set; }
        public string Nvarchar4000Value9 { get; set; }
        public string Nvarchar4000Value10 { get; set; }
        public string NvarcharMaxValue1 { get; set; }
        public string NvarcharMaxValue2 { get; set; }
        public string NvarcharMaxValue3 { get; set; }
        public string NvarcharMaxValue4 { get; set; }
        public string NvarcharMaxValue5 { get; set; }
        public string NvarcharMaxValue6 { get; set; }
        public string NvarcharMaxValue7 { get; set; }
        public string NvarcharMaxValue8 { get; set; }
        public string NvarcharMaxValue9 { get; set; }
        public string NvarcharMaxValue10 { get; set; }
    }
}