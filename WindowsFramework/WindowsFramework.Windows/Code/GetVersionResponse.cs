using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Windows.Code
{
    public class GetVersionResponse : Response
    {
        public string BinVersion { get; set; }
        public string ConfigsVersion { get; set; }
        public string ImagesVersion { get; set; }
    }
}
