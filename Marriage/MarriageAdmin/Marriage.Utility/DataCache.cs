using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Utility
{
    public class DataCache
    {
        const string DesKey = "userlogintokedeskey12345";

        static System.Collections.Concurrent.ConcurrentDictionary<Guid, string> _UserTokenDictionary = new System.Collections.Concurrent.ConcurrentDictionary<Guid, string>();

        public static bool JudgeToken(Guid adminUserId, string token)
        {
            if (_UserTokenDictionary.ContainsKey(adminUserId))
            {
                if (_UserTokenDictionary[adminUserId].Equals(token))
                {
                    DateTime loginDate = DateTime.Parse(OpenDataAccessCore.Utility.DESEncryptor.HexDecrypt(token, DesKey));
                    if (loginDate.AddDays(1) > DateTime.Now) return true;
                }
            }
            return false;
        }

        public static string AddLoginToken(Guid adminUserId)
        {
            string token = OpenDataAccessCore.Utility.DESEncryptor.HexEncrypt(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DesKey);
            _UserTokenDictionary.AddOrUpdate(adminUserId, token, (key, value) => { return token; });

            return token;
        }
    }
}
