using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Utility
{
    public class DataCache
    {
        static System.Collections.Concurrent.ConcurrentDictionary<string, AppAccessToken> _AppAccessTokenDictionary = new System.Collections.Concurrent.ConcurrentDictionary<string, AppAccessToken>();
        static System.Collections.Concurrent.ConcurrentDictionary<Guid, int> _EndLiveCountDictionary = new System.Collections.Concurrent.ConcurrentDictionary<Guid, int>();
       
        public static void AddAppAccessToken(string appId, AppAccessToken appAccessToken)
        {
            _AppAccessTokenDictionary.AddOrUpdate(appId, appAccessToken, (key, value) => { return appAccessToken; });
        }

        public static void AddEndLiveCount(Guid liveId, int count)
        {
            _EndLiveCountDictionary.AddOrUpdate(liveId, count, (key, value) => { return count; });
        }

        public static int GetEndLiveCount(Guid liveId)
        {
            if (_EndLiveCountDictionary.ContainsKey(liveId))
            {
                int count = 0;
                _EndLiveCountDictionary.TryGetValue(liveId, out count);
                return count;
            }

            return 0;
        }

        public static void RemoveEndLiveCount(Guid liveId)
        {
            _EndLiveCountDictionary.Remove(liveId, out _);
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
