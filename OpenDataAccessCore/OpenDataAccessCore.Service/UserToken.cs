using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace OpenDataAccessCore.Service
{
    public class UserToken
    {
        private const String _DesKey = "userlogintokedeskey12345";

        public static int Exprie { get; set; }

        static UserToken()
        {
            Exprie = 1;
        }

        public static string CreateToken(string userId)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("UserId", userId);
            dict.Add("LoginDate", DateTime.Now);

            return DESEncryptor.Encrypt(Common.ToJson(dict), _DesKey);
        }

        public static string ParseToken(string token)
        {
            if (string.IsNullOrEmpty(token)) return string.Empty;
            try
            {
                string content = DESEncryptor.Decrypt(token, _DesKey);

                Dictionary<string, object> dict = Common.JsonToDictionary(content);
                DateTime loginDate = dict.GetValue<DateTime>("LoginDate");

                if (loginDate.AddDays(Exprie) > DateTime.Now) return dict.GetStringValue("UserId");
            }
            catch
            {
                throw new Exception("Token解析异常！");
            }

            throw new Exception("Token过期！");
        }
    }
}
