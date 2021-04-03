using System;
using System.Collections.Generic;
using System.Text;

namespace OpenDataAccessCore.Utility
{
    public class AppSettings
    {
        public static Func<string, string> GetAppSettingFunc { get; set; }

        public static string GetAppSetting(string key)
        {
            if (GetAppSettingFunc != null) return GetAppSettingFunc(key);

            return string.Empty;
        }
    }
}
