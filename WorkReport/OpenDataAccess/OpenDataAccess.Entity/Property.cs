using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace OpenDataAccess.Entity
{
    public class Property
    {
        public string Name { get; set; }
        public Type Type { get; set; }
        public object Value { get; set; }
        public string ParameterName { get; set; }
        public bool IsSelect { get; set; }
    }
}
