using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Serialization;

namespace Marriage.Utility
{
    public class Common
    {
        /// <summary>
        /// 获取指定类型值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="str"></param>
        /// <returns></returns>
        public static T GetValue<T>(string str)
        {
            object value = ChangeType(str, typeof(T));
            if (value != null)
            {
                return (T)value;
            }
            return default(T);
        }

        /// <summary>
        /// 获取指定类型值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static T GetValue<T>(object obj)
        {
            object value = ChangeType(obj, typeof(T));
            if (value != null)
            {
                return (T)value;
            }
            return default(T);
        }

        public static List<T> StringSplitTo<T>(string str, char[] chs)
        {
            if (string.IsNullOrEmpty(str)) return null;
            string[] list = str.Split(chs);
            return list.Select(s => GetValue<T>(s.Trim())).ToList();
        }

        /// <summary>
        /// 改变值类型
        /// </summary>
        /// <param name="value"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static object ChangeType(object value, Type type)
        {
            if (value == null)
            {
                return null;
            }
            if (type != typeof(string) && string.IsNullOrEmpty(value.ToString()))
            {
                return null;
            }
            if (type == typeof(Guid) || type == typeof(Nullable<Guid>))
            {
                if (value is Guid)
                {
                    return value;
                }
                return new Guid(value.ToString());
            }
            else if (type == typeof(int) || type == typeof(Nullable<int>))
            {
                if (value is int)
                {
                    return value;
                }
                return int.Parse(value.ToString());
            }
            else if (type == typeof(char) || type == typeof(Nullable<char>))
            {
                if (value is char)
                {
                    return value;
                }
                return char.Parse(value.ToString());
            }
            else if (type == typeof(byte) || type == typeof(Nullable<byte>))
            {
                if (value is byte)
                {
                    return value;
                }
                return byte.Parse(value.ToString());
            }
            else if (type == typeof(short) || type == typeof(Nullable<short>))
            {
                if (value is short)
                {
                    return value;
                }
                return short.Parse(value.ToString());
            }
            else if (type == typeof(long) || type == typeof(Nullable<long>))
            {
                if (value is long)
                {
                    return value;
                }
                return long.Parse(value.ToString());
            }
            else if (type == typeof(decimal) || type == typeof(Nullable<decimal>))
            {
                if (value is decimal)
                {
                    return value;
                }
                return decimal.Parse(value.ToString());
            }
            else if (type == typeof(double) || type == typeof(Nullable<double>))
            {
                if (value is double)
                {
                    return value;
                }
                return double.Parse(value.ToString());
            }
            else if (type == typeof(bool) || type == typeof(Nullable<bool>))
            {
                if (value is bool)
                {
                    return value;
                }
                if (value.ToString() == "1")
                {
                    return true;
                }
                else if (value.ToString().Trim().ToLower() == "true")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else if (type == typeof(float) || type == typeof(Nullable<float>))
            {
                if (value is float)
                {
                    return value;
                }
                return float.Parse(value.ToString());
            }
            else if (type == typeof(DateTime) || type == typeof(Nullable<DateTime>))
            {
                if (value is DateTime)
                {
                    return value;
                }
                return DateTime.Parse(value.ToString());
            }
            else if (type == typeof(string))
            {
                if (value is string)
                {
                    return value;
                }
                return value.ToString();
            }
            else if (type == typeof(byte[]) && value is string)
            {
                return value.ToString().Split(',').Select(s => byte.Parse(s)).ToArray();
            }
            else
            {
                return value;
            }
        }

        /// <summary>
        /// 获取异常信息
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static string GetExceptionMessage(Exception ex)
        {
            return GetInnerException(ex).Message;
        }

        public static string ComputeStreamMd5(Stream stream)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            byte[] bytes = md5.ComputeHash(stream);
            return BytesToHexString(bytes);
        }

        public static string ComputeStreamSHA1(Stream stream)
        {
            SHA1 sha1 = SHA1.Create();
            byte[] bytes = sha1.ComputeHash(stream);
            return BytesToHexString(bytes);
        }

        public static string ComputeStringSHA1(string str)
        {
            Stream stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(str));
            return ComputeStreamSHA1(stream);
        }

        public static string ComputeStringMd5(string str)
        {
            Stream stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(str));
            return ComputeStreamMd5(stream);
        }

        public static long GetDateTotalSeconds(DateTime date)
        {
            return (long)(date.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds;
        }

        /// <summary>
        /// 获取异常对象
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static Exception GetInnerException(Exception ex)
        {
            if (ex.InnerException != null)
            {
                return GetInnerException(ex.InnerException);
            }
            return ex;
        }

        /// <summary>
        /// 将键值对列表转化成指定对象列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dictList"></param>
        /// <returns></returns>
        public static List<T> DictionaryListToList<T>(List<Dictionary<string, object>> dictList) where T : class
        {
            List<T> objList = new List<T>();
            dictList.ForEach(dict =>
            {
                objList.Add(DictionaryTo<T>(dict));
            });
            return objList;
        }

        /// <summary>
        /// 将键值对转化成指定对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dict"></param>
        /// <returns></returns>
        public static T DictionaryTo<T>(Dictionary<string, object> dict) where T : class
        {
            T obj = Activator.CreateInstance<T>();
            return DictionaryToObject(dict, obj) as T;
        }

        /// <summary>
        /// 将对象转为Json字符串
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string SerializeObjectToJson(object obj, bool isShort = false)
        {
            string result = string.Empty;
            try
            {
                IsoDateTimeConverter convert = new IsoDateTimeConverter();
                if (isShort)
                {
                    convert.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";
                }
                else
                {
                    convert.DateTimeFormat = "yyyy-MM-dd HH:mm:ss.fff";
                }
                result = JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.None, convert);
            }
            catch (Exception)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// 将键值对转化成指定对象
        /// </summary>
        /// <param name="dict"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static object DictionaryToObject(Dictionary<string, object> dict, object obj)
        {
            Type type = obj.GetType();
            foreach (KeyValuePair<string, object> kvp in dict)
            {
                PropertyInfo property = type.GetProperty(kvp.Key);
                if (property != null && kvp.Value != null && kvp.Value != DBNull.Value)
                {
                    Type propertyType = property.PropertyType;
                    object childObj = null;
                    if (kvp.Value is List<Dictionary<string, object>>)
                    {
                        if (propertyType.IsGenericType)
                        {
                            object childList = Activator.CreateInstance(propertyType);
                            Type argumentType = propertyType.GetGenericArguments()[0];
                            foreach (Dictionary<string, object> childDict in kvp.Value as List<Dictionary<string, object>>)
                            {
                                childObj = Activator.CreateInstance(argumentType);
                                childObj = DictionaryToObject(childDict, childObj);
                                propertyType.InvokeMember("Add", BindingFlags.InvokeMethod | BindingFlags.Public | BindingFlags.Instance, null, childList, new object[] { childObj });
                            }
                            property.SetValue(obj, childList, null);
                        }
                    }
                    else if (kvp.Value is Dictionary<string, object>)
                    {
                        childObj = Activator.CreateInstance(propertyType);
                        property.SetValue(obj, DictionaryToObject(kvp.Value as Dictionary<string, object>, childObj), null);
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
            return obj;
        }

        public static T JsonToObject<T>(string jsonText)
        {
           return JsonConvert.DeserializeObject<T>(jsonText);
        }

        /// <summary>
        /// 将JSON文本转换成数据行 
        /// </summary>
        /// <param name="jsonText"></param>
        /// <returns></returns>
        public static Dictionary<string, object> JsonToDictionary(string jsonText)
        {
            Dictionary<string, object> dict = JsonToObject<Dictionary<string, object>>(jsonText);
            return ParseJsonContent(dict);
        }

        public static List<Dictionary<string, object>> ParseJsonContent(string jsonText)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            object obj = JsonConvert.DeserializeObject(jsonText);
            ParseJsonContent(obj, dictList);
            return dictList;
        }

        private static void ParseJsonContent(object obj, List<Dictionary<string, object>> dictList)
        {
            if (obj is Dictionary<string, object> || obj is JObject)
            {
                dictList.Add(ParseJsonContent(obj));
            }
            else if (obj is object[] || obj is ArrayList || obj is JArray)
            {
                dictList.AddRange(ParseJsonContentList(obj));
            }
        }

        private static Dictionary<string, object> ParseJsonContent(object obj)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            if (obj is Dictionary<string, object>)
            {
                foreach (KeyValuePair<string, object> kvp in obj as Dictionary<string, object>)
                {
                    if (kvp.Value is Dictionary<string, object> || kvp.Value is JObject)
                    {
                        dict.Add(kvp.Key, ParseJsonContent(kvp.Value));
                    }
                    else if (kvp.Value is object[])
                    {
                        dict.Add(kvp.Key, ParseJsonContentList(kvp.Value));
                    }
                    else if (kvp.Value is ArrayList || kvp.Value is JArray)
                    {
                        dict.Add(kvp.Key, ParseJsonContentList(kvp.Value));
                    }
                    else
                    {
                        dict.Add(kvp.Key, kvp.Value);
                    }
                }
            }
            else if (obj is JObject)
            {
                foreach (var kvp in (obj as JObject))
                {
                    if (kvp.Value is JObject)
                    {
                        dict.Add(kvp.Key, ParseJsonContent(kvp.Value));
                    }
                    else if (kvp.Value is JArray)
                    {
                        dict.Add(kvp.Key, ParseJsonContentList(kvp.Value));
                    }
                    else
                    {
                        dict.Add(kvp.Key, kvp.Value);
                    }
                }
            }
            return dict;
        }

        public static string UTF16To8(string str)
        {
            byte[] utf16Bytes = Encoding.Unicode.GetBytes(str);
            byte[] utf8Bytes = Encoding.Convert(Encoding.Unicode, Encoding.UTF8, utf16Bytes);
            return Encoding.UTF8.GetString(utf8Bytes);
        }

        public static long GetDateTotalMilliseconds(DateTime dateTime)
        {
            return (long)(dateTime.ToUniversalTime() - new DateTime(1970, 1, 1)).TotalMilliseconds;
        }

        public static DateTime MillisecondsToDateTime(long milliseconds)
        {
            return new DateTime(1970, 1, 1).AddMilliseconds(milliseconds).ToLocalTime();
        }
        
        private static List<Dictionary<string, object>> ParseJsonContentList(object obj)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            if (obj is object[])
            {
                object[] arrayObj = obj as object[];
                foreach (object item in arrayObj)
                {
                    if (item is Dictionary<string, object>)
                    {
                        dictList.Add(ParseJsonContent(item));
                    }
                }
            }
            else if (obj is ArrayList)
            {
                ArrayList arrayList = obj as ArrayList;
                foreach (object item in arrayList)
                {
                    if (item is Dictionary<string, object>)
                    {
                        dictList.Add(ParseJsonContent(item));
                    }
                }
            }
            else if (obj is JArray)
            {
                foreach (var item in (obj as JArray))
                {
                    if (item is JObject)
                    {
                        dictList.Add(ParseJsonContent(item));
                    }
                }
            }
            return dictList;
        }

        public static string AddJsQuotation(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return "\"\"";
            }
            else
            {
                str = str.Replace("\\", "\\\\");
                str = str.Replace("\"", "\\\"");
                return "\"" + str + "\"";
            }
        }

        public static string RemoveEnterOrWhiteSpace(string str)
        {
            if (!string.IsNullOrEmpty(str))
            {
                str = str.Replace("\n", "");
                while (str.IndexOf("  ") > 0)
                {
                    str = str.Replace("  ", " ");
                }
            }
            return str;
        }

        public static Dictionary<string, object> XmlToDictionary(string xml)
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);

            string json = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc);
            return JsonToDictionary(json);
        }

        public static string ToXml(object obj, bool blResolve = false, string rootName = null, string xmlns = null)
        {
            string xml = string.Empty;
            if (obj != null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    XmlSerializer xs = new XmlSerializer(obj.GetType());
                    XmlSerializerNamespaces ns = new XmlSerializerNamespaces();
                    ns.Add("", "");

                    xs.Serialize(ms, obj, ns);
                    ms.Position = 0;

                    using (StreamReader sr = new StreamReader(ms, System.Text.Encoding.UTF8))
                    {
                        xml = sr.ReadToEnd();
                    }
                }
            }

            xml = xml.Replace("<?xml version=\"1.0\"?>", string.Empty);

            if (!string.IsNullOrEmpty(rootName) && !string.IsNullOrEmpty(xmlns))
            {
                string rootName2 = string.Format("<{0}>", rootName);
                int index = xml.IndexOf(rootName2);
                if (index >= 0)
                {
                    int index2 = index + rootName2.Length;
                    rootName2 = string.Format("<{0} xmlns=\"{1}\">", rootName, xmlns);
                    xml = string.Concat(index > 0 ? xml.Substring(0, index) : string.Empty, rootName2, xml.Substring(index2));
                }
            }

            if (blResolve)
            {
                xml = string.Concat("<?xml version=\"1.0\" encoding=\"utf-8\" ?>", xml);
            }

            return xml;
        }

        public static string ResolveXmlTemplate(string xml, Dictionary<string, object> dict, bool blEncode = true)
        {
            Dictionary<string, object> dict2 = new Dictionary<string, object>();
            string key = string.Empty;
            foreach (var kvp in dict)
            {
                key = string.Concat("{#", Guid.NewGuid().ToString().Replace("-", string.Empty), "}");
                dict2.Add(key, kvp.Value);
                xml = Regex.Replace(xml, string.Concat("{#", kvp.Key, "}"), key, RegexOptions.IgnoreCase);
            }
            foreach (var kvp in dict2)
            {
                xml = xml.Replace(kvp.Key, GetValueToXmlValue(kvp.Value, blEncode));
            }
            return xml;
        }

        public static string GetValueToXmlValue(object obj, bool blEncode = true)
        {
            string value = string.Empty;
            if (obj == null)
            {
                return string.Empty;
            }
            else if (obj is string)
            {
                string s = obj.ToString();
                if (blEncode)
                {
                    s = s.Replace("<", "&lt;");
                    s = s.Replace(">", "&gt;");
                    s = s.Replace("&", "&amp;");
                    s = s.Replace("\"", "&quot;");
                    s = s.Replace("'", "&apos;");
                }
                return s;
            }
            else if (obj is Guid)
            {
                return string.Concat("{", ((Guid)obj).ToString(), "}");
            }
            else if (obj is DateTime)
            {
                return ((DateTime)obj).ToString("yyyy-MM-dd HH:mm:ss");
            }
            return obj.ToString();
        }

        /// <summary>
        /// 3Des加密
        /// </summary>
        /// <param name="key"></param>
        /// <param name="content"></param>
        /// <param name="blBase64"></param>
        /// <returns></returns>
        public static string DesEncrypt(string key, string content, bool blBase64 = true)
        {
            byte[] rgbKey = blBase64 ? Convert.FromBase64String(key) : Encoding.UTF8.GetBytes(key);
            byte[] rgbIV = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };
            byte[] inputByteArray = Encoding.UTF8.GetBytes(content);

            TripleDESCryptoServiceProvider des = new TripleDESCryptoServiceProvider();
            des.Mode = System.Security.Cryptography.CipherMode.ECB;
            des.Padding = System.Security.Cryptography.PaddingMode.PKCS7;

            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(rgbKey, rgbIV), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            content = Convert.ToBase64String(ms.ToArray());

            cs.Close();
            ms.Close();

            return content;
        }

        /// <summary>
        /// 3Des加密解密
        /// </summary>
        /// <param name="key"></param>
        /// <param name="content"></param>
        /// <param name="blBase64"></param>
        /// <returns></returns>
        public static string DesDecrypt(string key, string content, bool blBase64 = true)
        {
            byte[] rgbKey = blBase64 ? Convert.FromBase64String(key) : Encoding.UTF8.GetBytes(key);
            byte[] rgbIV = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };
            byte[] inputByteArray = Convert.FromBase64String(content);

            TripleDESCryptoServiceProvider des = new TripleDESCryptoServiceProvider();
            des.Mode = System.Security.Cryptography.CipherMode.ECB;
            des.Padding = System.Security.Cryptography.PaddingMode.PKCS7;

            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(rgbKey, rgbIV), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            content = Encoding.UTF8.GetString(ms.ToArray());

            cs.Close();
            ms.Close();

            return content;
        }

        /// <summary>
        /// 计算SHA256值
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        public static string ComputeSHA256(string content)
        {
            SHA256CryptoServiceProvider sha = new SHA256CryptoServiceProvider();

            byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(content));

            return BitConverter.ToString(bytes).Replace("-", string.Empty).ToLower();
        }

        /// <summary>
        /// 将Xml文档2Dictionary
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        public static Dictionary<string, object> XmlToDictionary(XmlDocument doc)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();

            dict.Add(doc.DocumentElement.Name, XmlElementToObject(doc.DocumentElement));

            return dict;
        }

        /// <summary>
        /// XmlEmlement To Object
        /// </summary>
        /// <param name="xmlElement"></param>
        /// <returns></returns>
        private static object XmlElementToObject(XmlElement xmlElement)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            if (xmlElement.HasAttributes)
            {
                foreach (XmlAttribute a in xmlElement.Attributes)
                {
                    dict[a.Name] = a.Value;
                }
            }

            string text = string.Empty;

            if (xmlElement.HasChildNodes)
            {
                object value = null, obj = null;
                string name = string.Empty;
                List<Dictionary<string, object>> dictList = null;

                foreach (var e in xmlElement.ChildNodes)
                {
                    if (e is XmlElement)
                    {
                        obj = XmlElementToObject(e as XmlElement);
                        name = (e as XmlElement).Name;
                    }
                    else if (e is XmlText)
                    {
                        text = (e as XmlText).InnerText;
                        break;
                    }

                    value = null;
                    if (dict.ContainsKey(name))
                    {
                        value = dict[name];
                    }

                    if (value == null)
                    {
                        dict[name] = obj;
                    }
                    else if (value is Dictionary<string, object>)
                    {
                        dictList = new List<Dictionary<string, object>>();
                        dictList.Add(value as Dictionary<string, object>);
                        if (obj is Dictionary<string, object>)
                        {
                            dictList.Add(obj as Dictionary<string, object>);
                            dict[name] = dictList;
                        }
                        else
                        {
                            dict[name] = obj;
                        }
                    }
                    else if (value is List<Dictionary<string, object>>)
                    {
                        if (obj is Dictionary<string, object>)
                        {
                            dictList = value as List<Dictionary<string, object>>;
                            dictList.Add(obj as Dictionary<string, object>);
                            dict[name] = dictList;
                        }
                        else
                        {
                            dict[name] = obj;
                        }
                    }
                }
            }

            if (!string.IsNullOrEmpty(text))
            {
                return text;
            }
            else if (dict.Count == 0)
            {
                return string.Empty;
            }

            return dict;
        }

        public static List<string> GetTagList(string content, string startTag, string endTag)
        {
            int startIndex = 0;
            int endIndex = 0;
            int resultIndex = 0;
            List<string> tagList = new List<string>();
            string tag = "";
            while (resultIndex >= 0)
            {
                resultIndex = content.IndexOf(startTag, startIndex, StringComparison.CurrentCultureIgnoreCase);
                if (resultIndex >= 0)
                {
                    endIndex = content.IndexOf(endTag, resultIndex, StringComparison.CurrentCultureIgnoreCase);
                    if (endIndex >= 0)
                    {
                        tag = content.Substring(resultIndex, endIndex - resultIndex + endTag.Length);
                        tagList.Add(tag);
                    }
                    startIndex = resultIndex + startTag.Length;
                }
            }
            return tagList;
        }

        public static Stream GetFileStream(string path)
        {
            FileWebRequest webRequest = (FileWebRequest)HttpWebRequest.Create(path);
            using (FileWebResponse webResponse = (FileWebResponse)webRequest.GetResponse())
            {
                Stream stream = webResponse.GetResponseStream();

                byte[] bytes = new byte[stream.Length];
                stream.Read(bytes, 0, bytes.Length);

                return new MemoryStream(bytes);
            }
        }

        public static string BytesToHexString(byte[] bytes)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                sb.Append(bytes[i].ToString("X2"));
            }
            return sb.ToString();
        }

        public static string ToJson(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static string AddUrlRandom(string url)
        {
            if (string.IsNullOrEmpty(url)) return string.Empty;

            string rc = Common.GetRandomChars();
            string rd = DateTime.Now.ToString("yyyyMMddHHmmssfff") + new Random().Next(100000, 999999);
            url += url.IndexOf("?") > 0 ? "&" : "?";
            url += string.Format("_r{0}={1}", rc, rd);

            return url;
        }

        public static string GetRandomChars(int len = 0)
        {
            len = len == 0 ? 10 : len;
            char[] chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz".ToCharArray();
            List<char> list = new List<char>();
            Random r = new Random((int)DateTime.Now.Ticks);
            for (int i = 0; i < len; i++)
            {
                list.Add(chars[r.Next(0, chars.Length - 1)]);
            }
            return string.Join("", list);
        }
        /// <summary>
        /// 图片转为base64编码的字符串
        /// </summary>
        /// <param name="Imagefilename"></param>
        /// <returns></returns>
        public static string ImgToBase64String(string Imagefilename)
        {
            try
            {
                Bitmap bmp = new Bitmap(Imagefilename);

                MemoryStream ms = new MemoryStream();
                bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                byte[] arr = new byte[ms.Length];
                ms.Position = 0;
                ms.Read(arr, 0, (int)ms.Length);
                ms.Close();
                return Convert.ToBase64String(arr);
            }
            catch
            {
                throw;
            }
        }

        public static List<List<T>> ListToBatchList<T>(List<T> list, int num)
        {
            if (list == null || list.Count == 0) return new List<List<T>>();

            List<List<T>> batchList = new List<List<T>>();
            List<T> list2 = null;

            int iCount = list.Count % num == 0 ? list.Count / num : list.Count / num + 1;
            for (var i = 1; i <= iCount; i++)
            {
                list2 = new List<T>();
                for (int j = (i - 1) * num; j < i * num; j++)
                {
                    if (j < list.Count) list2.Add(list[j]);
                    else break;
                }
                batchList.Add(list2);
            }

            return batchList;
        }
    }
}
