using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace WindowsFramework.Utility
{
    public class Common
    {
        /// <summary>
        /// 匿名对象转换成键值对
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static Dictionary<string, object> AnonymityToDictionary(object obj)
        {
            if (obj == null) return null;

            Dictionary<string, object> dict = new Dictionary<string, object>();

            object propertyValue = null;
            List<Dictionary<string, object>> dictList = null;

            obj.GetType().GetProperties().ToList().ForEach(p =>
            {
                propertyValue = p.GetValue(obj);

                if (propertyValue == null)
                {
                    dict.Add(p.Name, null);
                }
                else if (p.PropertyType == typeof(object))
                {
                    dict.Add(p.Name, AnonymityToDictionary(propertyValue));
                }
                else if (p.PropertyType == typeof(List<object>))
                {
                    dictList = new List<Dictionary<string, object>>();
                    (propertyValue as List<object>).ForEach(v =>
                    {
                        dictList.Add(AnonymityToDictionary(v));
                    });

                    dict.Add(p.Name, dictList);
                }
                else
                {
                    dict.Add(p.Name, propertyValue);
                }
            });

            return dict;
        }

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

        public static T JsonToObject<T>(string jsonText)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            return jsSerializer.Deserialize<T>(jsonText);
        }

        public static Dictionary<string, object> JsonToDictionary(string jsonText)
        {
            Dictionary<string, object> dict = JsonToObject<Dictionary<string, object>>(jsonText);
            return ParseJsonContent(dict);
        }

        public static List<Dictionary<string, object>> ParseJsonContent(string jsonText)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            object obj = jsSerializer.DeserializeObject(jsonText);
            ParseJsonContent(obj, dictList);
            return dictList;
        }

        private static void ParseJsonContent(object obj, List<Dictionary<string, object>> dictList)
        {
            if (obj is Dictionary<string, object>)
            {
                dictList.Add(ParseJsonContent(obj));
            }
            else if (obj is object[] || obj is ArrayList)
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
                    if (kvp.Value is Dictionary<string, object>)
                    {
                        dict.Add(kvp.Key, ParseJsonContent(kvp.Value));
                    }
                    else if (kvp.Value is object[])
                    {
                        dict.Add(kvp.Key, ParseJsonContentList(kvp.Value));
                    }
                    else if (kvp.Value is ArrayList)
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
            return dictList;
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

        public static string ToJson(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        /// <summary>
        /// 计算流MD5值
        /// </summary>
        /// <returns></returns>
        public static string ComputeStreamMd5(Stream stream)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            byte[] bytes = md5.ComputeHash(stream);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                sb.Append(bytes[i].ToString("x2"));
            }
            return sb.ToString();
        }

        public static string ComputeStringMd5(string str)
        {
            Stream stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(str));
            return ComputeStreamMd5(stream);
        }

        public static T MapTo<T>(object obj) where T : class
        {
            T obj2 = Activator.CreateInstance<T>();
            return MapToObject(obj, obj2) as T;
        }

        private static object ObjectToObject(Type type, object obj1)
        {
            if (type == typeof(string) || type.IsValueType)
            {
                return Common.ChangeType(obj1, type);
            }
            else if (type.IsClass)
            {
                try
                {
                    object obj2 = Activator.CreateInstance(type);
                    return MapToObject(obj1, obj2);
                }
                catch
                {
                    return Common.ChangeType(obj1, type);
                }
            }
            else
            {
                return Common.ChangeType(obj1, type);
            }
        }

        public static object MapToObject(object source, object target)
        {
            if (source == null) return null;

            var list = (from a in source.GetType().GetProperties()
                        from b in target.GetType().GetProperties()
                        where a.Name.Equals(b.Name)
                        select new { a, b });

            Type argumentType = null;
            object value = null;
            object childObj = null;
            object childList = null;
            Type elementType = null;
            ArrayList objList = null;

            foreach (var c in list)
            {
                value = c.a.GetValue(source);

                if (c.a.PropertyType == c.b.PropertyType)
                {
                    c.b.SetValue(target, value);
                }
                else
                {
                    if (c.b.PropertyType.IsGenericType && value is IEnumerable)
                    {
                        argumentType = c.b.PropertyType.GetGenericArguments()[0];
                        childList = Activator.CreateInstance(c.b.PropertyType);

                        foreach (var obj in GetObjectList(value as IEnumerable))
                        {
                            childObj = ObjectToObject(argumentType, obj);

                            c.b.PropertyType.InvokeMember("Add", BindingFlags.InvokeMethod | BindingFlags.Public | BindingFlags.Instance, null, childList, new object[] { childObj });
                        }

                        c.b.SetValue(target, childList);
                    }
                    else if (c.b.PropertyType.IsArray)
                    {
                        elementType = c.b.PropertyType.GetElementType();
                        objList = new ArrayList();

                        if (value is IEnumerable)
                        {
                            foreach (var item in value as IEnumerable)
                            {
                                childObj = ObjectToObject(elementType, item);
                                objList.Add(childObj);
                            }
                        }
                        else
                        {
                            objList = value as ArrayList;
                        }

                        if (objList != null)
                        {
                            c.b.SetValue(target, objList.ToArray(elementType));
                        }
                    }
                    else
                    {
                        c.b.SetValue(target, ObjectToObject(c.b.PropertyType, value));
                    }
                }
            }

            return target;
        }

        private static IEnumerable<object> GetObjectList(IEnumerable obj)
        {
            IEnumerator point = obj.GetEnumerator();
            while (point.MoveNext())
            {
                yield return point.Current;
            }
        }

        public static MemoryStream GetFileStream(string path)
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

        public static byte[] GetHttpFileBytes(string url)
        {
            HttpClient client = new HttpClient();
            return client.GetByteArrayAsync(url).Result;
        }

        public static MemoryStream GetHttpFileStream(string url)
        {
            HttpClient client = new HttpClient();
            using (Stream stream = client.GetStreamAsync(url).Result)
            {
                MemoryStream memoryStream = new MemoryStream();

                int count = 0;
                byte[] buffer = new byte[1024];
                while ((count = stream.Read(buffer, 0, 1024)) > 0)
                {
                    memoryStream.Write(buffer, 0, count);
                }
                memoryStream.Position = 0;

                return memoryStream;
            }
        }

        private static void GetFileList(ArrayList list, string rootPath, string path)
        {
            foreach (string f in Directory.GetFiles(path))
            {
                list.Add(new SerializeFileInfo(f.Substring(rootPath.Length), File.ReadAllBytes(f)));
            }

            foreach (string f in Directory.GetDirectories(path))
            {
                GetFileList(list, rootPath, f);
            }
        }

        public static void Compress(string dirPath, string fileName)
        {
            ArrayList list = new ArrayList();
            GetFileList(list, dirPath, dirPath);
            
            IFormatter formatter = new BinaryFormatter();
            using (MemoryStream ms = new MemoryStream())
            {
                formatter.Serialize(ms, list);
                ms.Position = 0;
                CreateCompressFile(ms, fileName);
            }
        }

        private static void CreateCompressFile(Stream source, string fileName)
        {
            using (Stream stream = new FileStream(fileName, FileMode.Create, FileAccess.Write))
            {
                using (GZipStream output = new GZipStream(stream, CompressionMode.Compress))
                {
                    byte[] bytes = new byte[4096];
                    int n = 0;
                    while ((n = source.Read(bytes, 0, bytes.Length)) != 0)
                    {
                        output.Write(bytes, 0, n);
                    }
                }
            }
        }

        public static void DeCompress(Stream source, string dirPath)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                using (GZipStream input = new GZipStream(source, CompressionMode.Decompress, true))
                {
                    byte[] bytes = new byte[4096];
                    int n = 0;
                    while ((n = input.Read(bytes, 0, bytes.Length)) != 0)
                    {
                        ms.Write(bytes, 0, n);
                    }
                }
                ms.Flush();
                ms.Position = 0;
                DeSerializeFiles(ms, dirPath);
            }
        }

        public static void DeCompress(byte[] source, string dirPath)
        {
            DeCompress(new MemoryStream(source), dirPath);
        }

        public static void DeCompress(string fileName, string dirPath)
        {
            using (Stream source = File.OpenRead(fileName))
            {
                DeCompress(source, dirPath);
            }
        }

        private static void DeSerializeFiles(Stream stream, string dirPath)
        {
            BinaryFormatter bf = new BinaryFormatter();
            ArrayList list = (ArrayList)bf.Deserialize(stream);

            string fileName = string.Empty;
            string dir = string.Empty;

            foreach (SerializeFileInfo f in list)
            {
                fileName = string.Concat(dirPath, f.FileName);
                dir = Path.GetDirectoryName(fileName);

                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

                using (FileStream fs = new FileStream(fileName, FileMode.Create, FileAccess.Write))
                {
                    fs.Write(f.FileBuffer, 0, f.FileBuffer.Length);
                    fs.Close();
                }
            }
        }
    }
}
