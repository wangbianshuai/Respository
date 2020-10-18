using System.Collections.Generic;

namespace OpenDataAccessCore.Utility
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

        public static string GetStringValue(this Dictionary<string, string> dict, string propertyName)
        {
            if (dict.ContainsKey(propertyName) && dict[propertyName] != null)
            {
                return dict[propertyName].ToString();
            }
            return string.Empty;
        }

        public static object GetValue(this Dictionary<string, object> dict, string propertyName)
        {
            if (dict.ContainsKey(propertyName) && dict[propertyName] != null)
            {
                return dict[propertyName];
            }
            return null;
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

        /// <summary>
        /// 转换为Boolean
        /// </summary>
        /// <param name="value">输入的内容</param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static bool TryBool(this object value, bool defValue)
        {
            bool temp = false;
            return bool.TryParse(value + "", out temp) ? temp : defValue;
        }
    }
}