using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using System.Web;
using System.Configuration;
using System.Data;
using System.Runtime.Serialization.Json;
using System.Web.Script.Serialization;
using System.Collections;
using System.IO.Compression;
using Newtonsoft.Json;

namespace OpenDataAccess.Utility
{
    public class Common
    {
        #region 该方法替换SQL关键字符
        /// <summary>
        /// 该方法替换SQL关键字符
        /// </summary>
        /// <param name="strInput"></param>
        /// <returns></returns>
        public static string SqlEscape(string strInput)
        {
            strInput = strInput.Replace("[", "[[]");
            strInput = strInput.Replace("_", "[_]");
            strInput = strInput.Replace("\\", "[\\]");
            strInput = strInput.Replace("%", "[%]");
            strInput = strInput.Replace("'", "''");
            return strInput;
        }
        #endregion

        #region 该方法获取请求参数值
        /// <summary>
        /// 该方法获取请求参数值
        /// </summary>
        /// <param name="context"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetRequestValue(HttpContext context, string key)
        {
            if (context.Request.QueryString[key] != null)
            {
                return context.Request.QueryString[key].Trim();
            }
            else if (context.Request.Form[key] != null)
            {
                return context.Request.Form[key].Trim();
            }
            else
            {
                return string.Empty;
            }
        }
        #endregion

        #region 字符串截断
        /// <summary>
        /// 字符串截断
        /// </summary>
        /// <param name="strUnicode">字符串</param>
        /// <param name="limitnum">截取长度</param>
        /// <returns></returns>
        public static string GetStrByLength(string strUnicode, int limitnum)
        {
            if (limitnum <= 0) return strUnicode;
            StringBuilder sb = new StringBuilder();
            int totalLength = 0;
            foreach (char contentChar in strUnicode)
            {
                int size = ((int)contentChar) > 255 ? 2 : 1;
                if (totalLength + size > limitnum)
                {
                    break;
                }
                sb.Append(contentChar);
                totalLength += size;
            }
            return sb.ToString();
        }
        #endregion

        #region 获取用户当前ip地址
        /// <summary>
        /// 获取用户当前ip地址
        /// </summary>
        /// <returns></returns>
        public static string GetRealIP(HttpRequestBase request)
        {
            string iPAddress = "";
            if (request.ServerVariables["REMOTE_ADDR"] != null)//发出请求的远程主机的IP地址
            {
                iPAddress = request.ServerVariables["REMOTE_ADDR"].ToString();
            }
            else if (request.ServerVariables["HTTP_VIA"] != null)//判断是否设置代理，若使用了代理
            {
                if (request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)//获取代理服务器的IP
                {
                    iPAddress = request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
                }
                else
                {
                    iPAddress = request.UserHostAddress;
                }
            }
            else
            {
                iPAddress = request.UserHostAddress;
            }
            return iPAddress;
        }
        #endregion

        #region 判断是否有HTML标签
        /// <summary>
        /// 判断是否有HTML标签
        /// </summary>
        /// <param name="str"></param>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string JudgeIsHtml(string str, string text)
        {
            if (RemoveUnsafeHtml(RemvoeHtmlTag(str)).Length < str.Length)
            {
                return "对不起，" + text + "输入了HTML标记字符！";
            }
            else
            {
                if (str.IndexOf('<') >= 0 || str.IndexOf('>') >= 0)
                {
                    return "对不起，" + text + "不能输入\"<\"或\">\"字符！";
                }
                else
                {
                    return string.Empty;
                }
            }
        }
        #endregion

        #region 过滤HTML中的不安全标签包括js,style,meta 等
        /// <summary>
        /// 过滤HTML中的不安全标签包括js,style,meta 等
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        public static string RemoveUnsafeHtml(string content)
        {
            if (content == null) return string.Empty;
            content = Regex.Replace(content, @"(\<|\s+)o([a-z]+\s?=)", "$1$2", RegexOptions.IgnoreCase);
            content = Regex.Replace(content, @"(script|frame|form|meta|behavior|style)([\s|:|>])+", "$1.$2", RegexOptions.IgnoreCase);
            return content;
        }
        #endregion

        #region 删除HTML标记
        /// <summary>
        /// 删除HTML标记
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public static string RemvoeHtmlTag(string html)
        {
            string[] aryRegex ={@"<%=[\w\W]*?%>",    @"<script[\w\W]*?</script>",     @"<style[\w\W]*?</style>",   @"<[/]?[\w\W]*?>",   @"([\r\n])[\s]+",
                              @"&(nbsp|#160);",    @"&(iexcl|#161);",  @"&(cent|#162);",            @"&(pound|#163);",   @"&(copy|#169);",
                              @"&#(\d+);",         @"-->",                          @"<!--.*\n"};
            string[] aryReplacment = { "", "", "", "", "", " ", "", "", "", "", "", "", "" };
            for (int i = 0; i < aryRegex.Length; i++)
            {
                Regex regex = new Regex(aryRegex[i], RegexOptions.IgnoreCase);
                html = regex.Replace(html, aryReplacment[i]);
            }
            html.Replace("\r\n", "");
            html.Replace("\t", "");
            return html;
        }
        #endregion

        #region 判断内容是否正确的HTML
        public static string JudgeIsRightHtml(string str, string text)
        {
            if (JudgeIsRightHtml(str) > 0)
            {
                return "对不起，" + text + "输入有不符合格式的HTML标记字符！";
            }
            else
            {
                return string.Empty;
            }
        }
        #endregion

        #region 判断内容是否正确的HTML
        /// <summary>
        /// 判断内容是否正确的HTML
        /// </summary>
        /// <param name="strContent"></param>
        /// <returns></returns>
        public static int JudgeIsRightHtml(string strContent)
        {
            strContent = Regex.Replace(strContent, @"<P[^>]*>([^<]*<HR[\s|/]*>)[\r\n\t\s]*</P>", "$1", RegexOptions.IgnoreCase);
            string tmpContent = "", tmpStr = "";
            string[] tmpArr = strContent.Split(new string[] { "<HR>", "<HR />", "<HR/>", "<hr />" }, StringSplitOptions.RemoveEmptyEntries);
            string htmlPattern = @"<[^>]+>";
            int row = 1;
            List<string> htmlTags = new List<string>();
            MatchCollection matchs;
            foreach (string tmpItem in tmpArr)
            {
                tmpContent = Regex.Replace(tmpItem, @"\r|\n|\t", "", RegexOptions.IgnoreCase);
                htmlTags.Clear();
                matchs = Regex.Matches(tmpContent, htmlPattern, RegexOptions.IgnoreCase);
                foreach (Match match in matchs)
                {
                    if (!(Regex.IsMatch(match.Value, @"^<embed", RegexOptions.IgnoreCase) || Regex.IsMatch(match.Value, @"^<param", RegexOptions.IgnoreCase) || Regex.IsMatch(match.Value, @"^</embed", RegexOptions.IgnoreCase) || Regex.IsMatch(match.Value, @"^</param", RegexOptions.IgnoreCase)))
                    {
                        if (!Regex.IsMatch(match.Value, @"^<IMG", RegexOptions.IgnoreCase) && !Regex.IsMatch(match.Value, @"^<BR", RegexOptions.IgnoreCase) && !Regex.IsMatch(match.Value, @"^<[^/]+/>", RegexOptions.IgnoreCase))
                        {
                            if (Regex.IsMatch(match.Value, @"</[^>]+>", RegexOptions.IgnoreCase))
                            {
                                tmpStr = Regex.Replace(match.Value, @"</([^>]+)>", "$1", RegexOptions.IgnoreCase).Trim();
                                if (htmlTags.Count == 0)
                                {
                                    htmlTags.Add(match.Value);
                                }
                                else
                                {
                                    if (Regex.IsMatch(htmlTags[htmlTags.Count - 1], @"^<" + tmpStr, RegexOptions.IgnoreCase))
                                    {
                                        htmlTags.RemoveAt(htmlTags.Count - 1);
                                    }
                                    else
                                    {
                                        htmlTags.Add(match.Value);

                                    }
                                }
                            }
                            else
                            {
                                htmlTags.Add(match.Value);
                            }
                        }
                    }
                }
                if (htmlTags.Count != 0)
                {
                    return row;
                }
                row++;
            }
            return 0;
        }
        #endregion

        public static string GetConfigValue(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }

        #region 该方法获取数据列宽度
        /// <summary>
        /// 该方法获取数据列宽度
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static Dictionary<string, int> GetColumnWidth(DataTable dt)
        {
            Dictionary<string, int> columnWidthDict = new Dictionary<string, int>();
            foreach (DataColumn col in dt.Columns)
            {
                columnWidthDict.Add(col.ColumnName.Trim(), GetStringHeaderWidth(col.ColumnName.Trim()) + 10);
            }
            int iWidth = 0;
            foreach (DataRow dr in dt.Rows)
            {
                foreach (DataColumn col in dt.Columns)
                {
                    iWidth = GetStringWidth(dr[col].ToString().Trim());
                    if (iWidth > columnWidthDict[col.ColumnName.Trim()])
                    {
                        columnWidthDict[col.ColumnName.Trim()] = iWidth;
                    }
                }
            }
            return columnWidthDict;
        }
        public static Dictionary<string, object> GetColumnWidth(List<Dictionary<string, object>> dictList, bool hasLabel)
        {
            Dictionary<string, object> columnWidthDict = new Dictionary<string, object>();
            if (dictList.Count > 0 && !hasLabel)
            {
                foreach (string key in dictList[0].Keys)
                {
                    columnWidthDict.Add(key, GetStringHeaderWidth(key) + 20);
                }
            }
            int iWidth = 0;
            dictList.ForEach(dict =>
            {
                foreach (KeyValuePair<string, object> kvp in dict)
                {
                    if (kvp.Value != null)
                    {
                        iWidth = GetStringWidth(kvp.Value.ToString());
                        if (columnWidthDict.ContainsKey(kvp.Key))
                        {
                            if (iWidth > (int)columnWidthDict[kvp.Key])
                            {
                                columnWidthDict[kvp.Key] = iWidth;
                            }
                        }
                        else
                        {
                            columnWidthDict.Add(kvp.Key, iWidth);
                        }
                    }
                }
            });
            return columnWidthDict;
        }
        #endregion

        #region 该方法获取字符串长度
        /// <summary>
        /// 该方法获取字符串长度
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public static int GetStringHeaderWidth(string strValue)
        {
            char[] chValue = strValue.ToCharArray();
            int iWidth = 0;
            bool IsTrue = false;
            foreach (char ch in chValue)
            {
                IsTrue = false;
                if (!IsTrue)
                {
                    if (char.IsNumber(ch))
                    {
                        iWidth += 7;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsLower(ch))
                    {
                        iWidth += 7;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsUpper(ch))
                    {
                        iWidth += 8;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsPunctuation(ch))
                    {
                        iWidth += 11;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsSeparator(ch))
                    {
                        iWidth += 11;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsSymbol(ch))
                    {
                        iWidth += 11;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    iWidth += 15;
                }

            }
            return iWidth;
        }
        #endregion

        #region 该方法获取字符串长度
        /// <summary>
        /// 该方法获取字符串长度
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public static int GetStringWidth(string strValue)
        {
            char[] chValue = strValue.ToCharArray();
            int iWidth = 0;
            bool IsTrue = false;
            foreach (char ch in chValue)
            {
                IsTrue = false;
                if (!IsTrue)
                {
                    if (char.IsNumber(ch))
                    {
                        iWidth += 7;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsLower(ch))
                    {
                        iWidth += 7;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsUpper(ch))
                    {
                        iWidth += 8;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsPunctuation(ch))
                    {
                        iWidth += 11;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsSeparator(ch))
                    {
                        iWidth += 11;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    if (char.IsSymbol(ch))
                    {
                        iWidth += 11;
                        IsTrue = true;
                    }
                }
                if (!IsTrue)
                {
                    iWidth += 13;
                }

            }
            return iWidth;
        }
        #endregion

        /// <summary>
        /// Json序列化,用于发送到客户端
        /// </summary>
        public static string ToJsJson(object item)
        {

            DataContractJsonSerializer serializer = new DataContractJsonSerializer(item.GetType());

            using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
            {

                serializer.WriteObject(ms, item);

                StringBuilder sb = new StringBuilder();

                sb.Append(Encoding.UTF8.GetString(ms.ToArray()));

                return sb.ToString();

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

        public static string ToBase64String(string str)
        {
            return HttpUtility.UrlEncode(Convert.ToBase64String(Encoding.UTF8.GetBytes(str)));
        }

        public static string FromBase64String(string str)
        {
            try
            {
                return Encoding.UTF8.GetString(Convert.FromBase64String(HttpUtility.UrlDecode(str)));
            }
            catch
            {
                return str;
            }
        }

        /// <summary>
        /// Json反序列化,用于接收客户端Json后生成对应的对象
        /// </summary>
        public static T FromJsonTo<T>(string jsonString)
        {

            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
           
            System.IO.MemoryStream ms = new System.IO.MemoryStream(Encoding.UTF8.GetBytes(jsonString));

            T jsonObject = (T)ser.ReadObject(ms);

            ms.Close();

            return jsonObject;

        }

        public static Object Json2Obj(string json, Type t)
        {
            try
            {
                System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(t);
                using (System.IO.MemoryStream ms = new System.IO.MemoryStream(Encoding.UTF8.GetBytes(json)))
                {
                    return serializer.ReadObject(ms);
                }
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// 根据指定Sequence的值生成GUID。
        /// </summary>
        /// <param name="sequence">输入参数,Sequence</param>
        /// <returns>Sequence为GUID的前8个字节</returns>
        public static Guid GetCuidFromData(int sequence)
        {
            return new Guid(sequence, 0, 0, new byte[] { 0, 0, 0, 0, 0, 0, 0, 0 });
        }

        /// <summary> 
        /// 对象转JSON 
        /// </summary> 
        /// <param name="obj">对象</param> 
        /// <returns>JSON格式的字符串</returns> 
        public static string ObjectToJSON(object obj)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            try
            {
                return jsSerializer.Serialize(obj);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// JSON文本转对象,泛型方法 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="jsonText"></param>
        /// <returns></returns>
        public static T JSONToObject<T>(string jsonText)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            try
            {
                return jsSerializer.Deserialize<T>(jsonText);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// 将JSON文本转换成数据行 
        /// </summary>
        /// <param name="jsonText"></param>
        /// <returns></returns>
        public static Dictionary<string, object> JsonToDictionary(string jsonText)
        {
            Dictionary<string, object> dict = JSONToObject<Dictionary<string, object>>(jsonText);
            return ParseJsonConent(dict);
        }

        public static List<Dictionary<string, object>> ParseJsonContent(string jsonText)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            object obj = jsSerializer.DeserializeObject(jsonText);
            ParseJsonConent(obj, dictList);
            return dictList;
        }

        private static void ParseJsonConent(object obj, List<Dictionary<string, object>> dictList)
        {
            if (obj is Dictionary<string, object>)
            {
                dictList.Add(ParseJsonConent(obj));
            }
            else if (obj is object[] || obj is ArrayList)
            {
                dictList.AddRange(ParseJsonConentList(obj));
            }
        }

        private static Dictionary<string, object> ParseJsonConent(object obj)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            if (obj is Dictionary<string, object>)
            {
                foreach (KeyValuePair<string, object> kvp in obj as Dictionary<string, object>)
                {
                    if (kvp.Value is Dictionary<string, object>)
                    {
                        dict.Add(kvp.Key, ParseJsonConent(kvp.Value));
                    }
                    else if (kvp.Value is object[])
                    {
                        dict.Add(kvp.Key, ParseJsonConentList(kvp.Value));
                    }
                    else if (kvp.Value is ArrayList)
                    {
                        dict.Add(kvp.Key, ParseJsonConentList(kvp.Value));
                    }
                    else
                    {
                        dict.Add(kvp.Key, kvp.Value);
                    }
                }
            }
            return dict;
        }

        private static List<Dictionary<string, object>> ParseJsonConentList(object obj) 
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            if (obj is object[])
            {
                object[] arrayObj = obj as object[];
                foreach (object item in arrayObj)
                {
                    if (item is Dictionary<string, object>)
                    {
                        dictList.Add(ParseJsonConent(item));
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
                        dictList.Add(ParseJsonConent(item));
                    }
                }
            }
            return dictList;
        }

        public static int GzipCompress(string xlsPath, string zipPath, string xlsFileName)
        {
            //文件流 
            FileStream reader;
            reader = File.Open(xlsPath, FileMode.Open);
            FileStream writer;
            writer = File.Create(zipPath);

            //压缩相关的流 
            MemoryStream ms = new MemoryStream();
            GZipStream zipStream = new GZipStream(ms, CompressionMode.Compress, true);

            //往压缩流中写数据 
            byte[] sourceBuffer = new byte[reader.Length];


            reader.Read(sourceBuffer, 0, sourceBuffer.Length);
            zipStream.Write(sourceBuffer, 0, sourceBuffer.Length);

            //一定要在内存流读取之前关闭压缩流 
            zipStream.Close();
            zipStream.Dispose();

            //从内存流中读数据 
            ms.Position = 0; //注意，不要遗漏此句 
            byte[] destBuffer = new byte[ms.Length];
            //ms.Read(destBuffer, 0, destBuffer.Length);

            byte[] header = new byte[10];
            ms.Read(header, 0, 10);
            header[3] = 8;        //表示包含文件名信息
            byte[] fileContent = new byte[ms.Length - 10];
            ms.Read(fileContent, 0, fileContent.Length);

            byte[] filename = System.Text.Encoding.Default.GetBytes(xlsFileName);

            writer.Write(header, 0, header.Length);
            writer.Write(filename, 0, filename.Length);
            writer.WriteByte(0); //文件名以0 字节结束
            writer.Write(fileContent, 0, fileContent.Length);

            //关闭并释放内存流 
            ms.Close();
            ms.Dispose();

            //关闭并释放文件流 
            writer.Close();
            writer.Dispose();
            reader.Close();
            reader.Dispose();

            return fileContent.Length;
        }

        public static string DateToString(DateTime? date)
        {
            if (date == null)
            {
                return string.Empty;
            }
            return date.Value.ToString("yyyy-MM-dd HH:mm:ss");
        }

        public static Type GetType(string typeName)
        {
            switch (typeName.Trim().ToLower())
            {
                case "string":
                    {
                        return typeof(string);
                    }
                case "long":
                    {
                        return typeof(long);
                    }
                case "int":
                    {
                        return typeof(int);
                    }
                case "short":
                    {
                        return typeof(short);
                    }
                case "byte":
                    {
                        return typeof(byte);
                    }
                case "bool":
                    {
                        return typeof(bool);
                    }
                case "decimal":
                    {
                        return typeof(decimal);
                    }
                case "double":
                    {
                        return typeof(double);
                    }
                case "float":
                    {
                        return typeof(float);
                    }
                case "guid":
                    {
                        return typeof(Guid);
                    }
                case "datetime":
                    {
                        return typeof(DateTime);
                    }
                case "time": return typeof(DateTime);
                default:
                    {
                        return typeof(string);
                    }
            }
        }

        public static object ChangeType(object value, string typeName)
        {
            return ChangeType(value, GetType(typeName));
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

        public static void SaveFile(byte[] bytes, string fileName)
        {
            using (FileStream fs = new FileStream(fileName, FileMode.Create, FileAccess.Write))
            {
                fs.Write(bytes, 0, bytes.Length);
                fs.Close();
            }
        }

        public static string GetFileSize(int len)
        {
            if (len < 1000) return string.Format("{0}B", len);

            decimal k = (decimal)len / (decimal)1024;
            if (k < 1000) return string.Format("{0}K", decimal.Round(k, 2).ToString());

            k = k / 1024;
            if (k < 1000) return string.Format("{0}M", decimal.Round(k, 2).ToString());

            k = k / 1024;
            return string.Format("{0}G", decimal.Round(k, 2).ToString());
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

        public static string ToJson(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static bool IsEquals(object a, object b, bool blIgnoreCase = true)
        {
            if (a == null && b == null) return true;

            if ((a == null || b != null) || (a != null || b == null)) return false;

            if (a is string && b is string)
            {
                if (blIgnoreCase) return a.ToString().ToLower().Equals(b.ToString().ToLower());
                else return a.ToString().Equals(b.ToString());
            }
            return a.Equals(b);
        }
    }
}
