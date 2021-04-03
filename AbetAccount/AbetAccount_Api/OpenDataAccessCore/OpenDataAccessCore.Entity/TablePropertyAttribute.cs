using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccessCore.Entity
{
    public class TablePropertyAttribute : Attribute
    {
        public TablePropertyAttribute()
            : base()
        {
        }

        public string Name { get; set; }

        public string WithSql { get; set; }

        public string PrimaryKey { get; set; }

        /// <summary>
        /// 不许查询字段名集合
        /// </summary>
        public string NoSelectNames { get; set; }
    }
}
