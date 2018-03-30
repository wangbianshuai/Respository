using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace OpenDataAccess.Utility
{
    /// <summary>
    /// 标签解析
    /// </summary>
    public static class TagParse
    {
        public static string GetTagInfoList(string content, List<string> nameList, out List<TagInfo> tagInfoList)
        {
            tagInfoList = new List<TagInfo>();

            //替换引用内字符串
            Dictionary<Guid, string> strList = new Dictionary<Guid, string>();
            content = GetStringList(content, strList);
            content = GetSingleStringList(content, strList);

            //替换标签
            List<TagInfo> tagList = new List<TagInfo>();
            nameList.ForEach(n =>
            {
                int iCount = 0;
                int iCount2 = 0;
                do
                {
                    iCount = iCount2;
                    content = GetTagInfo(content, tagList, n);
                    iCount2 = tagList.Count;
                }
                while (iCount < iCount2);
            });

            //替回字符串
            tagList.ForEach(t =>
            {
                foreach (var kvp in strList)
                {
                    t.TagContent = t.TagContent.Replace(kvp.Key.ToString(), kvp.Value);
                }

                ParseTagAttributes(t);
            });

            tagInfoList = tagList;

            foreach (var kvp in strList)
            {
                content = content.Replace(kvp.Key.ToString(), kvp.Value);
            }

            return content;
        }

        static void ParseTagAttributes(TagInfo tag)
        {
            int index = tag.TagContent.IndexOf(">");
            string attrs = tag.TagContent.Substring(0, index + 1) + string.Format("</{0}>", tag.TagName);
            tag.TagContent = tag.TagContent.Substring(index + 1);
            tag.TagAttributes = GetDictionaryByName(XmlToDictionary(attrs), tag.TagName);
        }

        static Dictionary<string, object> XmlToDictionary(string xml)
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);

            string json = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc);
            return Common.JsonToDictionary(json);
        }

        static Dictionary<string, object> GetDictionaryByName(Dictionary<string, object> dict, string name)
        {
            return GetValueByName<Dictionary<string, object>>(dict, name);
        }

        static T GetValueByName<T>(Dictionary<string, object> dict, string name)
        {
            if (dict != null)
            {
                return dict.GetValue<T>(name);
            }

            return default(T);
        }

        static string GetTagInfo(string content, List<TagInfo> tagInfoList, string tagName)
        {
            string startTag = "<" + tagName;
            string endTag = "</" + tagName + ">";

            int startIndex = content.IndexOf(startTag);
            while (startIndex >= 0)
            {
                int i = content.IndexOf(startTag, startIndex + startTag.Length);
                if (i < 0)
                {
                    int endIndex = content.IndexOf(endTag, startIndex + startTag.Length);
                    if (endIndex > startIndex)
                    {
                        Guid repleaceId = Guid.NewGuid();
                        tagInfoList.Add(new TagInfo()
                        {
                            ReplaceId = repleaceId,
                            TagContent = content.Substring(startIndex, endIndex - startIndex),
                            TagName = tagName
                        });

                        content = content.Substring(0, startIndex) + repleaceId.ToString() + content.Substring(endIndex + endTag.Length);
                    }
                }

                startIndex = i;
            }

            return content;
        }

        static bool CompareChars(char[] a, char[] b)
        {
            if (a.Length != b.Length) return false;

            bool blEquals = true;

            for (int i = 0; i < a.Length; i++)
            {
                if (a[i] != b[i]) { blEquals = false; break; }
            }

            return blEquals;
        }

        /// <summary>
        /// 双引号字符串
        /// </summary>
        /// <param name="content"></param>
        /// <param name="strList"></param>
        /// <returns></returns>
        static string GetStringList(string content, Dictionary<Guid, string> strList)
        {
            MemoryStream input = new MemoryStream(Encoding.UTF8.GetBytes(content));
            MemoryStream output = new MemoryStream();
            MemoryStream output2 = null;

            char c = '\0';
            char preChar = '\0';
            int iRead = 0;

            bool blStart = false;
            bool blStart2 = false;
            Guid keyValue = Guid.Empty;
            string value = string.Empty;
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
                    keyValue = Guid.NewGuid();
                    strBytes = Encoding.UTF8.GetBytes(keyValue.ToString());
                    output.Write(strBytes, 0, strBytes.Length);
                    value = Encoding.UTF8.GetString(output2.ToArray());
                    strList.Add(keyValue, value);
                    output2 = null;
                }
                preChar = c;
                blStart2 = false;
            }

            content = Encoding.UTF8.GetString(output.ToArray());

            input.Close();
            output.Close();
            if (output2 != null) output2.Close();

            return content;
        }

        /// <summary>
        /// 单引用字符串
        /// </summary>
        /// <param name="content"></param>
        /// <param name="strList"></param>
        /// <returns></returns>
        static string GetSingleStringList(string content, Dictionary<Guid, string> strList)
        {
            MemoryStream input = new MemoryStream(Encoding.UTF8.GetBytes(content));
            MemoryStream output = new MemoryStream();
            MemoryStream output2 = null;

            char c = '\0';
            int iRead = 0;

            bool blStart = false;
            bool blStart2 = false;
            Guid keyValue = Guid.Empty;
            string value = string.Empty;
            byte[] strBytes = null;

            while ((iRead = input.ReadByte()) != -1)
            {
                c = (char)iRead;

                if (!blStart)
                {
                    blStart = c == '\'';
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

                if (blStart && !blStart2 && c == '\'')
                {
                    blStart = false;
                    keyValue = Guid.NewGuid();
                    strBytes = Encoding.UTF8.GetBytes(keyValue.ToString());
                    output.Write(strBytes, 0, strBytes.Length);
                    value = Encoding.UTF8.GetString(output2.ToArray());
                    strList.Add(keyValue, value);
                    output2 = null;
                }
                blStart2 = false;
            }

            content = Encoding.UTF8.GetString(output.ToArray());

            input.Close();
            output.Close();
            if (output2 != null) output2.Close();

            return content;
        }
    }

    public class TagInfo
    {
        /// <summary>
        /// 标签名
        /// </summary>
        public string TagName { get; set; }
        /// <summary>
        /// 标签内容
        /// </summary>
        public string TagContent { get; set; }
        /// <summary>
        /// 替换Id
        /// </summary>
        public Guid ReplaceId { get; set; }
        /// <summary>
        /// 解析后内容
        /// </summary>
        public string ResolveContent { get; set; }
        /// <summary>
        /// 标签属性
        /// </summary>
        public Dictionary<string, object> TagAttributes { get; set; }
    }
}
