using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Entity.Action
{
    public interface IRequest
    {
        string OperationUserId { get; set; }
    }

    public class Request : IRequest
    {
        public string OperationUserId { get; set; }
    }
}
