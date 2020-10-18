using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Application.Impl
{
    public class UserToken
    {
        private const String _DesKey = "userlogintokedeskey12345";

        public static int Exprie { get; set; }

        static UserToken()
        {
            Exprie = 1;
        }

        public static string CreateToken(Guid adminUserId, Guid appAccountId)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("AdminUserId", adminUserId);
            dict.Add("AppAccountId", appAccountId);
            dict.Add("LoginDate", DateTime.Now);

            return DESEncryptor.Encrypt(Common.ToJson(dict), _DesKey);
        }

        public static string ParseToken(string token, Guid appAccountId)
        {
            if (string.IsNullOrEmpty(token)) return string.Empty;
            string content = string.Empty;
            try
            {
                content = DESEncryptor.Decrypt(token, _DesKey);
            }
            catch
            {
                throw new Exception("Token解析异常！");
            }

            Dictionary<string, object> dict = Common.JsonToDictionary(content);
            DateTime loginDate = dict.GetValue<DateTime>("LoginDate");

            if (appAccountId != dict.GetValue<Guid>("AppAccountId")) throw new Exception("Token无效！");

            if (loginDate.AddDays(Exprie) > DateTime.Now) return dict.GetStringValue("AdminUserId");


            throw new Exception("Token过期！");
        }
    }
}
