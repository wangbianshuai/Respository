using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Utility
{
    public class UserToken
    {
        public static int Exprie { get; set; }

        static UserToken()
        {
            Exprie = 2;
        }

        public static string CreateToken(string userId, string sign)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("UserId", userId);
            dict.Add("LoginDate", DateTime.Now);

            return DESEncryptor.Encrypt(Common.ToJson(dict), sign);
        }

        public static string CreateChatToken(string chatId, string sign)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("ChatId", chatId);
            dict.Add("ChatDate", DateTime.Now);

            return DESEncryptor.Encrypt(Common.ToJson(dict), sign);
        }

        public static string ParseToken(string token, string sign)
        {
            if (string.IsNullOrEmpty(token)) throw new TokenException("Token不能为空！");
            string content = string.Empty;
            try
            {
                content = DESEncryptor.Decrypt(token, sign);
            }
            catch
            {
                throw new TokenException("Token解析异常！");
            }

            Dictionary<string, object> dict = Common.JsonToDictionary(content);
            DateTime loginDate = dict.GetValue<DateTime>("LoginDate");

            if (loginDate.AddHours(Exprie) > DateTime.Now) return dict.GetStringValue("UserId");


            throw new TokenException("Token过期！");
        }
    }
    public class TokenException : Exception
    {
        public TokenException(string message) : base(message)
        {
        }
    }
}
