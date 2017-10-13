using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Component.Code.Model
{
    public class User
    {
        public string LoginName { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }

        public List<string> NameList { get; set; }

    }
}
