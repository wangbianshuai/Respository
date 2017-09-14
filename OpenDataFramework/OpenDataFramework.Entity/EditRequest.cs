using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Entity
{
    public class EditRequest : IRequest
    {
        public List<Dictionary<string, object>> Data { get; set; }
    }
}
