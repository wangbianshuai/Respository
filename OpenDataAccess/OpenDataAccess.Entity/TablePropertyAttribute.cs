using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccess.Entity
{
    public class TablePropertyAttribute : Attribute
    {
        public TablePropertyAttribute()
            : base()
        {
        }

        public string Name { get; set; }

        public string PrimaryKey { get; set; }
    }
}
