using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Entity.Action.User
{
    public class LoginRequest : Request, IRequest
    {
        public string LoginName { get; set; }
        public string LoginPasword { get; set; }
    }

    public class LoginResponse : Response, IResponse
    {
        public string LoginName { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
    }
}
