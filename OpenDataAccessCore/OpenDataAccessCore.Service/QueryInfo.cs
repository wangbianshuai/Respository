using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;
using System.Data;
using OpenDataAccessCore.Data;

namespace OpenDataAccessCore.Service
{
    public class QueryInfo : EntityModel, IEntity
    {
        public string FieldSql { get; set; }
        public string OrderBySql { get; set; }
        public string GroupBySql { get; set; }
        public string GroupByFieldSql { get; set; }
        public string WhereSql { get; set; }
        public List<IDbDataParameter> ParameterList { get; set; }
        public bool HasLabel { get; set; }
        public List<WhereField> WhereFields { get; set; }
        public List<HeaderInfo> HeaderInfos { get; set; }
        public string ProcName { get; set; }

        public IQuery ToQuery(EntityType entity)
        {
            IQuery query = new Query(entity.TableName, entity.Name);
            query.Where(this.WhereSql, this.ParameterList);
            query.Select(this.FieldSql);
            query.OrderBy(this.OrderBySql);
            query.GroupBy(this.GroupBySql);
            return query;
        }

        public class WhereField
        {
            public string Name { get; set; }
            public string Label { get; set; }
            public string OperateLogic { get; set; }
            public bool IsDefault { get; set; }
            public string DataType { get; set; }
            public string Value { get; set; }
            public string Text { get; set; }
            public string ParameterName { get; set; }
            public Type Type { get; set; }
            public object ObjValue { get; set; }
        }

        public class HeaderInfo
        {
            public string Name { get; set; }
            public string Label { get; set; }
            public int Width { get; set; }
        }
    }
}
