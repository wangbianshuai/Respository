using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Windows.Media;
using System.Xml;
using System.Xml.Serialization;

namespace MouseSync.Code
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

        public static T GetValue<T>(object value)
        {
            return (T)ChangeType(value, typeof(T));
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

        public static T JsonTo<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }

        public static object JsonToObject(string json, Type type)
        {
            return JsonConvert.DeserializeObject(json, type);
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

        public static List<Dictionary<string, object>> MapToDictionaryList<T>(List<T> list)
        {
            if (list == null) return null;
            return (from a in list select MapToDictionary<T>(a)).ToList();
        }

        public static Dictionary<string, object> MapToDictionary<T>(T obj)
        {
            return ObjectToDictionary(obj);
        }

        public static List<Dictionary<string, object>> ObjectToDictionaryList(List<object> list)
        {
            if (list == null) return null;
            return (from a in list select ObjectToDictionary(a)).ToList();
        }

        public static Dictionary<string, object> ObjectToDictionary(object obj)
        {
            if (obj == null) return null;

            Dictionary<string, object> dict = new Dictionary<string, object>();

            List<PropertyInfo> propertyList = obj.GetType().GetProperties().ToList();

            Type argumentType = null;
            object value = null;

            List<Dictionary<string,object>> childList = null;

            foreach (var c in propertyList)
            {
                value = c.GetValue(obj);

                if (c.PropertyType.IsGenericType && value is IEnumerable)
                {
                    argumentType = c.PropertyType.GetGenericArguments()[0];
                    childList = new List<Dictionary<string, object>>();

                    foreach (var childObj in GetObjectList(value as IEnumerable))
                    {
                        childList.Add(ObjectToDictionary(childObj));
                    }

                    dict.Add(c.Name, childList);
                }
                else
                {
                    dict.Add(c.Name, value);
                }
            }

            return dict;
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
            webRequest.Timeout = 60 * 1000 * 20;
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
            client.Timeout = new TimeSpan(0, 20, 0);
            return client.GetByteArrayAsync(url).Result;
        }

        public static MemoryStream GetHttpFileStream(string url)
        {
            HttpClient client = new HttpClient();
            client.Timeout = new TimeSpan(0, 20, 0);
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

        public static System.Drawing.Image GetImage(string url)
        {
            return System.Drawing.Image.FromStream(GetImageStream(url));
        }

        public static Stream GetImageStream(string url)
        {
            System.IO.MemoryStream ms = new MemoryStream();
            var webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.ProtocolVersion = HttpVersion.Version11;
            using (HttpWebResponse webResponse = (HttpWebResponse)webRequest.GetResponse())
            {
                Stream stream = webResponse.GetResponseStream();
                if (webResponse.StatusCode == HttpStatusCode.OK)
                {
                    stream.CopyTo(ms);
                    ms.Position = 0;
                    return ms;
                }
            }

            return null;
        }

        private static void GetFileList(Dictionary<string, object> dict, string rootPath, string path)
        {
            foreach (string f in Directory.GetFiles(path))
            {
                dict.Add(f.Substring(rootPath.Length), File.ReadAllBytes(f));
            }

            foreach (string f in Directory.GetDirectories(path))
            {
                GetFileList(dict, rootPath, f);
            }
        }

        public static void Compress(string dirPath, string fileName)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            GetFileList(dict, dirPath, dirPath);

            IFormatter formatter = new BinaryFormatter();
            using (MemoryStream ms = new MemoryStream())
            {
                formatter.Serialize(ms, dict);
                ms.Position = 0;
                CreateCompressFile(ms, fileName);
            }
        }

        public static void SaveImage(string url, string fileName)
        {
            System.Drawing.Image img = GetImage(url);
            img.Save(fileName);
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

        public static byte[] CompressBytes(byte[] bs)
        {
            MemoryStream source = new MemoryStream(bs);
            MemoryStream ms = new MemoryStream();
            using (GZipStream output = new GZipStream(ms, CompressionMode.Compress))
            {
                byte[] bytes = new byte[4096];
                int n = 0;
                while ((n = source.Read(bytes, 0, bytes.Length)) != 0)
                {
                    output.Write(bytes, 0, n);
                }
            }
            return ms.ToArray();
        }

        public static byte[] DeCompressBytes(byte[] bs)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                using (GZipStream input = new GZipStream(new MemoryStream(bs), CompressionMode.Decompress, true))
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
                return ms.ToArray();
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
            Dictionary<string, object> dict = (Dictionary<string, object>)bf.Deserialize(stream);

            string fileName = string.Empty;
            string dir = string.Empty;

            foreach (var kvp in dict)
            {
                fileName = string.Concat(dirPath, kvp.Key);
                dir = Path.GetDirectoryName(fileName);

                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

                byte[] bytes = (byte[])kvp.Value;
                using (FileStream fs = new FileStream(fileName, FileMode.Create, FileAccess.Write))
                {
                    fs.Write(bytes, 0, bytes.Length);
                    fs.Close();
                }
            }
        }

        public static Color GetColor(string color)
        {
            return (Color)ColorConverter.ConvertFromString(color);
        }

        /// <summary>
        /// 对象序例化成XML
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string XmlSerialize<T>(T obj)
        {
            XmlSerializerNamespaces nameSpace = new XmlSerializerNamespaces();
            nameSpace.Add("", "");
            MemoryStream ms = new MemoryStream();
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
            using (XmlWriter xmlWriter = XmlWriter.Create(ms))
            {
                xmlSerializer.Serialize(xmlWriter, obj, nameSpace);
            }
            return Encoding.UTF8.GetString(ms.ToArray());
        }

        /// <summary>  
        /// XML反序列化成对象  
        /// </summary>  
        public static T XmlDeserialize<T>(string xml)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
            using (TextReader textReader = new StringReader(xml))
            {
                return (T)xmlSerializer.Deserialize(textReader);
            }
        }

        /// <summary>
        /// 字符串转化成Base64编码
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string ToBase64String(string str)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
        }

        /// <summary>
        /// Base64编码转化成字符串
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string FromBase64String(string str)
        {
            return Encoding.UTF8.GetString(Convert.FromBase64String(str));
        }

        /// <summary>
        /// SHA1withRSA签名
        /// </summary>
        /// <param name="content"></param>
        /// <param name="xmlString"></param>
        /// <returns></returns>
        public static string SHA1Sign(string content, string xmlString)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(content);
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            rsa.FromXmlString(xmlString);
            using (var sh = SHA1.Create())
            {
                return BytesToHexString(rsa.SignData(bytes, sh));
            }
        }

        /// <summary>
        /// 取得证书私钥
        /// </summary>
        /// <param name="pfxPath">证书的绝对路径</param>
        /// <param name="password">访问证书的密码</param>
        /// <returns></returns>
        public static String GetPrivateKey(string pfxPath, string password)
        {
            X509Certificate2 pfx = new X509Certificate2(pfxPath, password, X509KeyStorageFlags.Exportable);
            return pfx.PrivateKey.ToXmlString(true);
        }

        /// <summary>
        /// 取得证书的公钥
        /// </summary>
        /// <param name="cerPath">证书的绝对路径</param>
        /// <returns></returns>
        public static String GetPublicKey(string cerPath)
        {
            X509Certificate2 cer = new X509Certificate2(cerPath);
            return cer.PublicKey.Key.ToXmlString(false);
        }

        /// <summary>
        /// 验签
        /// </summary>
        /// <param name="content"></param>
        /// <param name="sign"></param>
        /// <param name="xmlString"></param>
        /// <returns></returns>
        public static bool SHA1VerifySign(string content, string sign, string xmlString)
        {
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            rsa.FromXmlString(xmlString);
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();
            return rsa.VerifyData(Convert.FromBase64String(content), sha1, HexStringToBytes(sign));
        }

        /// <summary>
        /// 字节数组转化成十六进制字符串
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static string BytesToHexString(byte[] bytes)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                sb.Append(bytes[i].ToString("X2"));
            }
            return sb.ToString(); ;
        }

        /// <summary>
        /// 十六进制字符串转换成字节数组
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static byte[] HexStringToBytes(string str)
        {
            str = str.Replace("\n", "");
            str = str.Replace("\r", "");
            str = str.Trim();
            byte[] bytes = new byte[str.Length / 2];
            for (int i = 0; i < str.Length; i += 2) bytes[i / 2] = Convert.ToByte(str.Substring(i, 2), 16);
            return bytes;
        }

        public static T GetConcurrentQueuetItem<T>(System.Collections.Concurrent.ConcurrentQueue<T> list, Func<T, bool> where, bool blDesc = false)
        {
            List<T> list2 = new List<T>();
            T data = default(T);

            T lastData = default(T);

            if (blDesc)
            {
                lastData = list.Reverse().Where(f => where(f)).FirstOrDefault();
                if (lastData == null) return data;
                else
                {
                    while (!list.IsEmpty && list.Count > 0)
                    {
                        if (list.TryDequeue(out data))
                        {
                            if (data.Equals(lastData)) break;
                            else list2.Add(data);
                        }
                        else break;
                    }
                }
            }
            else
            {
                while (!list.IsEmpty && list.Count > 0)
                {
                    if (list.TryDequeue(out data))
                    {
                        if (where(data)) break;
                        else list2.Add(data);
                    }
                    else break;
                }
            }

            if (list.Count > 0) list2.ForEach(d => list.Enqueue(d));

            return data;
        }

        public static List<List<T>> ListToBatchList<T>(List<T> list, int num)
        {
            List<List<T>> batchList = new List<List<T>>();
            List<T> list2 = null;

            int count = list.Count % num == 0 ? list.Count / num : list.Count / num + 1;

            for (int i = 1; i <= count; i++)
            {
                list2 = new List<T>();

                for (int j = (i - 1) * num; j < i * num; j++) if (j < list.Count) list2.Add(list[j]);

                batchList.Add(list2);
            }

            return batchList;
        }

        public static List<T[]> ArrayToBatchList<T>(T[] arrs, int num, Func<int, int, int, T[]> initArray = null, int initStartIndex = 0)
        {
            List<T[]> batchList = new List<T[]>();
            T[] arrs2 = null;

            int count = arrs.Length % num == 0 ? arrs.Length / num : arrs.Length / num + 1;
            int len = 0;
            int startIndex = 0;

            for (int i = 1; i <= count; i++)
            {
                startIndex = (i - 1) * num;
                len = i == count ? arrs.Length - startIndex : num;
                arrs2 = initArray == null ? new T[len] : initArray(i, count, len);

                for (int j = startIndex; j < i * num; j++) if (j < arrs.Length) arrs2[j - startIndex + initStartIndex] = arrs[j];

                batchList.Add(arrs2);
            }

            return batchList;
        }

        public static void ConcurrentStackRemove<T>(ConcurrentStack<T> list, T obj)
        {
            T item = default(T);

            List<T> list2 = new List<T>();

            while (!list.IsEmpty && list.Count > 0)
            {
                if (list.TryPop(out item))
                {
                    if (obj.Equals(item)) break;
                    else list2.Add(item);
                }
                else break;
            }

            if (list2.Count > 0)
            {
                list2.Reverse();
                list2.ForEach(d => list.Push(d));
            }
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
            for (int i = 0; i < len; i++)
            {
                list.Add(chars[new Random().Next(0, chars.Length - 1)]);
            }
            return string.Join("", list);
        }

        public static double GetStringWidth(string str, double fontSize)
        {
            if (string.IsNullOrEmpty(str)) return 0;

            double count = 0;
            foreach (char ch in str)
            {
                count += ((int)ch) > 255 ? 2 : 1;
            }

            return fontSize * count / 2 + 10;
        }

        public static double GetStringHeight(string str, double width, double fontSize)
        {
            double strWidth = GetStringWidth(str, fontSize);

            return (Convert.ToInt32(strWidth / width) + 1) * (fontSize + fontSize / 2 + 1);
        }

        public static string DateToString(DateTime? date)
        {
            if (date == null)
            {
                return string.Empty;
            }
            return date.Value.ToString("yyyy-MM-dd HH:mm:ss");
        }

        public static string GetLocalIPAddress()
        {
            IPHostEntry ipe = Dns.GetHostEntry(Dns.GetHostName());
            IPAddress[] ip = ipe.AddressList;
            for (int i = 0; i < ip.Length; i++)
            {
                if (ip[i].AddressFamily.ToString().Equals("InterNetwork")) return ip[i].ToString();
            }
            return null;
        }

        private static string FormatMac(PhysicalAddress mac)
        {
            if (mac == null) return string.Empty;
            else
            {
                string str = mac.ToString();
                List<string> strList = new List<string>();
                int index = 0;
                while (index < str.Length)
                {
                    strList.Add(str.Substring(index, 2));
                    index += 2;
                }

                return string.Join("-", strList);
            }
        }

        public static string GetIpMacAddress(string ip)
        {
            return FormatMac(GetIpPhysicalAddress(ip));
        }

        public static PhysicalAddress GetIpPhysicalAddress(string ip)
        {
            PhysicalAddress mac = null;

            List<NetworkInterface> list = (from a in NetworkInterface.GetAllNetworkInterfaces()
                                           where a.NetworkInterfaceType == NetworkInterfaceType.Ethernet
                                           && a.OperationalStatus == OperationalStatus.Up
                                           select a).ToList();

            if (list.Count == 0)
            {
                NetworkInterface net = (from a in NetworkInterface.GetAllNetworkInterfaces()
                                        where a.NetworkInterfaceType == NetworkInterfaceType.Ethernet
                                        select a).FirstOrDefault();
                return net == null ? null : net.GetPhysicalAddress();
            }
            else if (list.Count == 1) mac = list[0].GetPhysicalAddress();

            IPInterfaceProperties p = null;
            foreach (var n in list)
            {
                p = n.GetIPProperties();
                if (p.UnicastAddresses.ToList().Exists(w => w.Address.ToString() == ip)) return n.GetPhysicalAddress();
            }

            return list[0].GetPhysicalAddress();
        }

        public static T GetJsonData<T>(string dirPath, string name)
        {
            if (!Directory.Exists(dirPath)) Directory.CreateDirectory(dirPath);

            string path = string.Format("{0}\\{1}.json", dirPath, name);

            if (!File.Exists(path))
            {
                using (var f = File.Create(path)) return default(T);
            }

            string content = string.Empty;

            using (TextReader reader = new StreamReader(path))
            {
                content = reader.ReadToEnd();
            }

            if (string.IsNullOrEmpty(content)) return default(T);

            return JsonConvert.DeserializeObject<T>(content);
        }

        public static void SaveJsonData<T>(string dirPath, string name, T obj)
        {
            if (!Directory.Exists(dirPath)) Directory.CreateDirectory(dirPath);

            string path = string.Format("{0}\\{1}.json", dirPath, name);

            string content = JsonConvert.SerializeObject(obj);

            using (TextWriter writer = new StreamWriter(path))
            {
                writer.Write(content);
                writer.Flush();
            }
        }

        public static string GetRandomColor()
        {
            Random RandomNum_First = new Random((int)DateTime.Now.Ticks);

            System.Threading.Thread.Sleep(RandomNum_First.Next(50));

            Random RandomNum_Sencond = new Random((int)DateTime.Now.Ticks);

            int int_Red = RandomNum_First.Next(256);
            int int_Green = RandomNum_Sencond.Next(256);
            int int_Blue = (int_Red + int_Green > 400) ? 0 : 400 - int_Red - int_Green;

            int_Blue = (int_Blue > 255) ? 255 : int_Blue;

            return System.Drawing.ColorTranslator.ToHtml(System.Drawing.Color.FromArgb(int_Red, int_Green, int_Blue));
        }

        public static bool CompareBytes(byte[] a, byte[] b)
        {
            if (a == null && b == null) return true;
            if (a == null || b == null) return false;

            if (a.Length != b.Length) return false;

            bool blEquals = true;
            for (int i = 0; i < a.Length; i++)
            {
                if (a[i] != b[i]) { blEquals = false; break; }
            }
            return blEquals;
        }
    }
}
