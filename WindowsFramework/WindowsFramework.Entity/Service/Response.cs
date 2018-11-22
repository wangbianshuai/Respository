using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Entity.Service
{
    public interface IResponse
    {
        bool Result { get; set; }
        string Message { get; set; }
    }

    public class Response : IResponse
    {
        public bool Result { get; set; }
        public string Message { get; set; }
        public string ErrorCode { get; set; }
    }
}
