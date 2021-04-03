using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Utility
{
    public class DataCache
    {
        static System.Collections.Concurrent.ConcurrentDictionary<string, AppAccessToken> _AppAccessTokenDictionary = new System.Collections.Concurrent.ConcurrentDictionary<string, AppAccessToken>();

        public static void AddAppAccessToken(string appId, AppAccessToken appAccessToken)
        {
            _AppAccessTokenDictionary.AddOrUpdate(appId, appAccessToken, (key, value) => { return appAccessToken; });
        }

        public static string GetAppAccessToken(string appId)
        {
            if (_AppAccessTokenDictionary.ContainsKey(appId))
            {
                AppAccessToken appAccessToken = null;
                _AppAccessTokenDictionary.TryGetValue(appId, out appAccessToken);
                if (appAccessToken != null && appAccessToken.ExpiresEndDate >= DateTime.Now) return appAccessToken.AccessToken;

                RemoveAppAccessToken(appId);
            }

            return string.Empty;
        }

        public static void RemoveAppAccessToken(string appId)
        {
            _AppAccessTokenDictionary.Remove(appId, out _);
        }

        public class AppAccessToken
        {
            /// <summary>
            /// 获取到的凭证
            /// </summary>
            public string AccessToken { get; set; }
            /// <summary>
            /// 凭证有效结束时间
            /// </summary>
            public DateTime ExpiresEndDate { get; set; }
        }
    }
}
