using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace EntityDataService.Utility
{
    public static class JsonParse
    {
        private const string FormatMessage = "JSON字符串格式不正确！";

        public static List<T> JsonToList<T>(string jsonString) where T : class, new()
        {
            ArrayList arrayList = JsonToArrayList(jsonString);

            if (arrayList != null)
            {
                List<T> list = new List<T>();
                Object item = null;
                for (int i = 0; i < arrayList.Count; i++)
                {
                    item = arrayList[i];
                    if (item is Dictionary<string, object>)
                    {
                        list.Add(DictionaryTo<T>((Dictionary<string, object>)item));
                    }
                }

                return list;
            }

            return null;
        }

        public static T JsonToTo<T>(string jsonString) where T : class, new()
        {
            List<T> list = JsonToList<T>(jsonString);
            return list == null ? null : list.FirstOrDefault();
        }

        private static T DictionaryTo<T>(Dictionary<string, object> dict) where T : class, new()
        {
            object obj = Activator.CreateInstance<T>();
            return (T)DictionaryToObject(obj, dict);
        }

        private static object DictionaryToObject(object obj, Dictionary<string, object> dict)
        {
            Type type = obj.GetType();
            foreach (KeyValuePair<string, object> kvp in dict)
            {
                PropertyInfo property = type.GetProperty(kvp.Key);
                if (property != null)
                {
                    if (kvp.Value == null)
                    {
                        property.SetValue(obj, null, null);
                    }
                    else
                    {
                        if (property.PropertyType.IsGenericType && kvp.Value is List<Dictionary<string, object>>)
                        {
                            SetListValue<List<Dictionary<string, object>>>(obj, property, kvp.Value as List<Dictionary<string, object>>);
                        }
                        else if (kvp.Value is Dictionary<string, object>)
                        {
                            property.SetValue(obj, DictionaryToObject(Activator.CreateInstance(property.PropertyType), kvp.Value as Dictionary<string, object>), null);
                        }
                        else if (property.PropertyType.IsArray && kvp.Value is ArrayList)
                        {
                            SetListValue<ArrayList>(obj, property, kvp.Value as ArrayList);
                        }
                        else if (property.PropertyType.IsGenericType && kvp.Value is ArrayList)
                        {
                            SetListValue<ArrayList>(obj, property, kvp.Value as ArrayList);
                        }
                        else
                        {
                            if (kvp.Value.GetType().Name == property.PropertyType.Name)
                            {
                                property.SetValue(obj, kvp.Value, null);
                            }
                            else
                            {
                                property.SetValue(obj, Common.ChangeType(kvp.Value, property.PropertyType), null);
                            }
                        }
                    }
                }
            }

            return obj;
        }

        private static void SetListValue<T>(object obj, PropertyInfo property, T value) where T : IEnumerable
        {
            object childObj = null;

            if (property.PropertyType.IsGenericType)
            {
                object childList = Activator.CreateInstance(property.PropertyType);
                Type argumentType = property.PropertyType.GetGenericArguments()[0];

                foreach (var item in value)
                {
                    if (item is Dictionary<string, object>)
                    {
                        childObj = Activator.CreateInstance(argumentType);
                        if (argumentType == typeof(Dictionary<string, object>))
                        {
                            childObj = item as Dictionary<string, object>;
                        }
                        else
                        {
                            childObj = DictionaryToObject(childObj, item as Dictionary<string, object>);
                        }
                    }
                    else
                    {
                        childObj = Common.ChangeType(item, argumentType);
                    }
                    property.PropertyType.InvokeMember("Add", BindingFlags.InvokeMethod | BindingFlags.Public | BindingFlags.Instance, null, childList, new object[] { childObj });
                }

                property.SetValue(obj, childList, null);
            }
            else if (property.PropertyType.IsArray)
            {
                Type elementType = property.PropertyType.GetElementType();
                ArrayList objList = new ArrayList();

                if ((value as ArrayList).Count > 0 && (value as ArrayList)[0] is Dictionary<string, object>)
                {
                    foreach (var item in value)
                    {
                        childObj = Activator.CreateInstance(elementType);
                        childObj = DictionaryToObject(childObj, item as Dictionary<string, object>);
                        objList.Add(childObj);
                    }
                }
                else
                {
                    objList = value as ArrayList;
                }

                property.SetValue(obj, objList.ToArray(elementType), null);
            }
        }

        public static Dictionary<string, object> JsonToDictionary(string jsonString)
        {
            return JsonToDictionaryList(jsonString).FirstOrDefault();
        }

        public static List<Dictionary<string, object>> JsonToDictionaryList(string jsonString)
        {
            ArrayList arrayList = JsonToArrayList(jsonString);

            if (arrayList == null)
            {
                return null;
            }

            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            foreach (var item in arrayList)
            {
                if (item is Dictionary<string, object>)
                {
                    list.Add(item as Dictionary<string, object>);
                }
            }

            return list;
        }

        public static ArrayList JsonToArrayList(string jsonString)
        {
            if (string.IsNullOrEmpty(jsonString))
            {
                return null;
            }

            jsonString = TrimWhiteEnter(jsonString);

            if (jsonString.Equals("{}"))
            {
                ArrayList list = new ArrayList();
                list.Add(new Dictionary<string, object>());
                return list;
            }

            if (jsonString.Equals("[]"))
            {
                return new ArrayList();
            }

            if (!CheckStartEnd(jsonString))
            {
                throw new Exception(FormatMessage);
            }

            //字符串属性名或值
            Dictionary<string, string> strList = new Dictionary<string, string>();
            jsonString = GetStringList(jsonString, strList);

            //Object字符串
            Dictionary<string, string> objList = new Dictionary<string, string>();

            int iCount = 0;
            int iCount2 = 0;
            do
            {
                iCount = iCount2;
                jsonString = GetObjectJsonStringList(jsonString, objList, false);
                iCount2 = objList.Count;
            }
            while (iCount < iCount2);

            //数组字符串
            Dictionary<string, string> arrayList = new Dictionary<string, string>();
            jsonString = GetArrayStringList(arrayList, jsonString);

            //Object中的数组
            objList.Keys.ToList().ForEach(key =>
            {
                objList[key] = GetArrayStringList(arrayList, objList[key]);
            });

            if (arrayList.Count > 0 || objList.Count > 0)
            {
                List<string> keyList = arrayList.Keys.ToList();
                keyList.AddRange(objList.Keys.ToList());

                return GetArrayList(jsonString, keyList, arrayList, objList, strList);
            }

            return null;
        }

        private static ArrayList GetArrayList(string jsonString, List<string> keyList, Dictionary<string, string> arrayList, Dictionary<string, string> objList, Dictionary<string, string> strList)
        {
            string[] strArray = jsonString.Split(',');

            if (keyList != null)
            {
                CheckKeyExists(strArray, keyList);
            }

            ArrayList list = new ArrayList();
            object obj = null;

            for (int i = 0; i < strArray.Length; i++)
            {
                obj = GetObjectValue(TrimWhiteEnter(strArray[i]), arrayList, objList, strList);
                if (obj != null) list.Add(obj);
            }

            if (keyList != null && list.Count == 1 && list[0] is ArrayList)
            {
                return (ArrayList)list[0];
            }

            return list;
        }

        private static object GetObjectValue(string value, Dictionary<string, string> arrayList, Dictionary<string, string> objList, Dictionary<string, string> strList)
        {
            object objValue = null;
            string value2 = null;

            //字符串值
            if (value.StartsWith("str") && value.Length == 35 && strList.ContainsKey(value))
            {
                value2 = strList[value];
            }

            if (value2 != null)
            {
                objValue = value2;
            }
            else
            {
                //数组值
                if (value.StartsWith("arr") && value.Length == 35 && arrayList.ContainsKey(value))
                {
                    value2 = arrayList[value];
                }
                if (value2 != null)
                {
                    objValue = GetArrayList(value2, null, arrayList, objList, strList);
                }
                else
                {
                    //Object值
                    if (value.StartsWith("obj") && value.Length == 35 && objList.ContainsKey(value))
                    {
                        value2 = objList[value];
                    }
                    if (value2 != null)
                    {
                        //Object
                        objValue = GetDictionary(value2, arrayList, objList, strList);
                    }
                }
            }
            if (value2 == null)
            {
                //boolean、int、double,null
                objValue = GetJsonValue(TrimWhiteEnter(value));
            }

            return objValue;
        }

        private static object GetJsonValue(string value)
        {
            if (string.IsNullOrEmpty(value) || value.ToLower().Equals("null"))
            {
                return null;
            }
            if (value.ToLower().Equals("true"))
            {
                return true;
            }
            if (value.ToLower().Equals("false"))
            {
                return false;
            }

            if (Common.CheckDouble(value))
            {
                return double.Parse(value);
            }

            if (Common.CheckNumber(value))
            {
                long lv = long.Parse(value);
                if (lv <= int.MaxValue && lv >= int.MinValue)
                {
                    return (int)lv;
                }
                return lv;
            }

            return value;
        }

        private static Dictionary<string, object> GetDictionary(string jsonString, Dictionary<string, string> arrayList, Dictionary<string, string> objList, Dictionary<string, string> strList)
        {
            string[] strArray = jsonString.Split(',');

            Dictionary<String, Object> dict = new Dictionary<String, Object>();

            string[] kv = null;
            string str = "", key = "", value = "";
            string keyValue = "";

            for (int i = 0; i < strArray.Length; i++)
            {
                str = strArray[i];
                kv = str.Split(':');

                if (kv.Length != 2)
                {
                    throw new Exception(FormatMessage);
                }

                key = TrimWhiteEnter(kv[0]);
                value = TrimWhiteEnter(kv[1]);

                if (strList.ContainsKey(key))
                {
                    keyValue = strList[key];
                }
                if (string.IsNullOrEmpty(keyValue))
                {
                    keyValue = key;
                }

                dict.Add(keyValue, GetObjectValue(value, arrayList, objList, strList));
            }

            return dict;
        }

        private static void CheckKeyExists(string[] strArray, List<String> keyList)
        {
            for (int i = 0; i < strArray.Length; i++)
            {
                if (!keyList.Contains(strArray[i]))
                {
                    throw new Exception(FormatMessage);
                }
            }
        }

        private static string GetArrayStringList(Dictionary<string, string> arrayList, string jsonString)
        {
            int iCount = 0;
            int iCount2 = 0;
            do
            {
                iCount = iCount2;
                jsonString = GetObjectJsonStringList(jsonString, arrayList, true);
                iCount2 = arrayList.Count;
            }
            while (iCount < iCount2);

            return jsonString;
        }

        private static String TrimWhiteEnter(String str)
        {
            str = Common.StringTrim(str);
            return Common.StringTrimEnter(str);
        }

        private static bool CheckStartEnd(string jsonString)
        {
            bool blSuccess = true;

            if (!jsonString.StartsWith("{") && !jsonString.StartsWith("[") && !jsonString.EndsWith("}") && !jsonString.EndsWith("]"))
            {
                blSuccess = false;
            }
            if (blSuccess && jsonString.StartsWith("{") && !jsonString.EndsWith("}"))
            {
                blSuccess = false;
            }
            if (blSuccess && jsonString.StartsWith("[") && !jsonString.EndsWith("]"))
            {
                blSuccess = false;
            }

            return blSuccess;
        }

        private static string GetStringList(string jsonString, Dictionary<string, string> strList)
        {
            MemoryStream input = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
            MemoryStream output = new MemoryStream();
            MemoryStream output2 = null;

            char c = '\0';
            char preChar = '\0';
            int iRead = 0;

            bool blStart = false;
            bool blStart2 = false;
            string keyValue = "", value = "";
            byte[] strBytes = null;

            while ((iRead = input.ReadByte()) != -1)
            {
                c = (char)iRead;

                if (!blStart)
                {
                    blStart = preChar != '\\' && c == '"';
                    if (blStart)
                    {
                        blStart2 = true;
                    }
                }

                if (blStart)
                {
                    if (blStart2)
                    {
                        output2 = new MemoryStream();
                    }
                }
                else
                {
                    output.WriteByte((byte)iRead);
                }

                if (output2 != null)
                {
                    output2.WriteByte((byte)iRead);
                }

                if (blStart && !blStart2 && preChar != '\\' && c == '"')
                {
                    blStart = false;
                    keyValue = string.Format("str{0}", Guid.NewGuid().ToString().Replace("-", ""));
                    strBytes = Encoding.UTF8.GetBytes(keyValue);
                    output.Write(strBytes, 0, strBytes.Length);
                    value = Encoding.UTF8.GetString(output2.ToArray());
                    value = value.Substring(1, value.Length - 2);
                    value = Common.Dencode(value);
                    strList.Add(keyValue, value);
                    output2 = null;
                }
                preChar = c;
                blStart2 = false;
            }

            jsonString = Encoding.UTF8.GetString(output.ToArray());

            input.Close();
            output.Close();
            if (output2 != null) output2.Close();

            return jsonString;
        }

        private static string GetObjectJsonStringList(string jsonString, Dictionary<string, string> objList, bool blArray)
        {
            if (!CheckStartEnd(jsonString))
            {
                return jsonString;
            }

            MemoryStream input = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
            MemoryStream output = new MemoryStream();
            MemoryStream output2 = null;

            char c = '\0';
            int iRead = 0;
            string keyValue = "", value = "";
            char sc = blArray ? '[' : '{';
            char ec = blArray ? ']' : '}';
            byte[] strBytes = null;

            while ((iRead = input.ReadByte()) != -1)
            {
                c = (char)iRead;

                if (c == sc)
                {
                    if (output2 != null)
                    {
                        output2.WriteTo(output);
                    }
                    output2 = new MemoryStream();
                }

                if (output2 != null)
                {
                    output2.WriteByte((byte)iRead);
                }
                else
                {
                    output.WriteByte((byte)iRead);
                }

                if (output2 != null && c == ec)
                {
                    keyValue = string.Format("{0}{1}", blArray ? "arr" : "obj", Guid.NewGuid().ToString().Replace("-", ""));
                    strBytes = Encoding.UTF8.GetBytes(keyValue);
                    output.Write(strBytes, 0, strBytes.Length);
                    value = Encoding.UTF8.GetString(output2.ToArray());
                    objList.Add(keyValue, value.Substring(1, value.Length - 2));
                    output2 = null;
                }
            }

            jsonString = Encoding.UTF8.GetString(output.ToArray());

            input.Close();
            output.Close();
            if (output2 != null) output2.Close();

            return jsonString;
        }
    }
}
