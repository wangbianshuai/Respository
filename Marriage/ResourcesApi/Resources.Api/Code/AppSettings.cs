using Microsoft.Extensions.Configuration;
using System;

namespace Resources.Api.Code
{
    public class AppSettings
    {
        static IConfigurationSection _AppSections { get; set; }

        public static string GetAppSetting(string key)
        {
            if (_AppSections.GetSection(key) != null) return _AppSections.GetSection(key).Value;

            return string.Empty;
        }

        public static void SetAppSetting(IConfigurationSection section)
        {
            _AppSections = section;

            OpenDataAccessCore.Utility.AppSettings.GetAppSettingFunc = (name) => { return GetAppSetting(name); };
        }
    }
}
