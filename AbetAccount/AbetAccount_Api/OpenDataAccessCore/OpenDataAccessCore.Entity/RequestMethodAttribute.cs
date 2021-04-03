using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccessCore.Entity
{
    public class RequestMethodAttribute : Attribute
    {
        public RequestMethodAttribute()
            : base()
        {
            this.IsDelete = true;
            this.IsGet = true;
            this.IsPost = true;
            this.IsPut = true;
        }

        public bool IsGet { get; set; }
        public bool IsPost { get; set; }
        public bool IsPut { get; set; }
        public bool IsDelete { get; set; }
    }
}
