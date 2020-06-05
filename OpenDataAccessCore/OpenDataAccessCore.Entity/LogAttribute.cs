using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccessCore.Entity
{
    public class LogAttribute : Attribute
    {
        public LogAttribute()
            : base()
        {
            this.IsDelete = true;
            this.IsGet = false;
            this.IsPost = true;
            this.IsPostQuery = false;
            this.IsPut = true;
        }

        public bool IsGet { get; set; }
        public bool IsPostQuery { get; set; }
        public bool IsPost { get; set; }
        public bool IsPut { get; set; }
        public bool IsDelete { get; set; }
    }

    public class NoLogAttribute : Attribute
    {
        public NoLogAttribute()
            : base()
        {
        }
    }
}
