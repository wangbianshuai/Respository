using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Entity.Service.User;
using WindowsFramework.Utility;

namespace WindowsFramework.Service.Impl
{
    public class User: BaseService, IUser
    {
        private string ServiceUrl { get; set; }

        public User()
        {
            ServiceUrl = AppSetting.ApiServiceUrl;
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public LoginResponse Login(LoginRequest request)
        {
            string url = string.Concat(this.ServiceUrl, "DataAccess/Query?IsLogin=true");

            var request2 = new
            {
                SelectNames = new List<string>() { "UserId", "LoginName", "UserName", "LastLoginDate", "DepartId", "DataRight" },
                Conditions = new List<object>()
                {
                    new {Name= "LoginName", Logic= "=", Value= request.LoginName},
                    new {Name= "LoginPassword", Logic= "=", Value= request.LoginPasword}
                }
            };

            var data = new
            {
                EntityName = "User",
                Request = request2
            };

            Dictionary<string, object> dict = this.PostRequestToDictionary(url, data);

            if (dict != null)
            {
                Dictionary<string, object> ack = dict.GetValue<Dictionary<string, object>>("Ack");
                if (ack.GetValue<bool>("IsSuccess"))
                {
                    Dictionary<string, object> data2 = dict.GetValue<Dictionary<string, object>>("Data");
                    if (data2.ContainsKey("DataList"))
                    {
                        dict = data2.GetValue<List<Dictionary<string, object>>>("DataList").FirstOrDefault();
                        if (dict != null)
                        {
                            LoginResponse response = Common.DictionaryTo<LoginResponse>(dict);
                            response.Result = true;
                            return response;
                        }
                    }
                }
                else
                {
                    return new LoginResponse() { Result = false, Message = ack.GetStringValue("StatusMessage") };
                }
            }

            return new LoginResponse() { Result = false, Message = "用户名或密码不正确！" };
        }
    }
}
