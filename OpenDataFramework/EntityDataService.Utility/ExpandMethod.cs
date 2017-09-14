using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EntityDataService.Utility
{
    public static class ExpandMethod
    {
        public static string GetStringValue(this Dictionary<string, object> dict, string propertyName)
        {
            if (dict.ContainsKey(propertyName) && dict[propertyName] != null)
            {
                return dict[propertyName].ToString();
            }
            return string.Empty;
        }

        public static T GetValue<T>(this Dictionary<string, object> dict, string propertyName)
        {
            if (dict.ContainsKey(propertyName) && dict[propertyName] != null)
            {
                if (dict[propertyName] is T)
                {
                    return (T)dict[propertyName];
                }
                else
                {
                    object value = Common.ChangeType(dict[propertyName], typeof(T));
                    if (value != null)
                    {
                        return (T)value;
                    }
                }
            }
            return default(T);
        }

        public static string GetValue(this Dictionary<string, string> dict, string propertyName)
        {
            if (dict.ContainsKey(propertyName) && !string.IsNullOrEmpty(dict[propertyName]))
            {
                return dict[propertyName].Trim();
            }
            return string.Empty;
        }

        public static T GetValue<T>(this Dictionary<string, string> dict, string propertyName)
        {
            if (dict.ContainsKey(propertyName) && !string.IsNullOrEmpty(dict[propertyName]))
            {
                object value = Common.ChangeType(dict[propertyName], typeof(T));
                if (value != null)
                {
                    return (T)value;
                }
            }
            return default(T);
        }
    }
}
