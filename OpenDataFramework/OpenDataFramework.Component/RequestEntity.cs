using EntityDataService.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Component
{
    public class RequestEntity
    {
        public Guid EntityId { get; set; }
        public string EntityName { get; set; }
        public string PrimaryKey { get; set; }
        public string MainTableName { get; set; }
        public string KeyNames { get; set; }
        public EntityType EntityType { get; set; }
        public bool IsRemove { get; set; }

        public List<RequestProperty> Properties { get; set; }

        public static string GetAsTableName(string tableName)
        {
            switch (tableName.ToLower())
            {
                case "t_d_datedatatable": return "d";
                case "t_d_datatable": return "t";
                case "t_d_expandstringtable": return "e";
                case "t_d_floatdatatable": return "f";
                case "t_d_guiddatatable": return "g";
                case "t_d_intdatatable": return "i";
                case "t_d_stringdatatable": return "s";
                default: return "t";
            }
        }
    }

    public class RequestProperty
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
        public bool IsConfig { get; set; }

        public string AsTableName
        {
            get
            {
                return RequestEntity.GetAsTableName(this.TableName);
            }
        }

        public RequestProperty()
        {
            IsConfig = true;
        }

    }
}
