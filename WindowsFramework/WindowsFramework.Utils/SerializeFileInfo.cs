using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Utility
{
    [Serializable]
    public class SerializeFileInfo
    {
        public string FileName { get; set; }
        public byte[] FileBuffer { get; set; }

        public SerializeFileInfo(string name, byte[] buffer)
        {
            FileName = name;
            FileBuffer = buffer;
        }
    }
}
