using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace StoryTestCases.Web.Code
{
    public class Common
    {
        public static Exception GetInnerException(Exception ex)
        {
            if (ex.InnerException != null)
            {
                return GetInnerException(ex.InnerException);
            }
            return ex;
        }


        public static string GetParameterValue(NameValueCollection queryString, string name)
        {
            string key = queryString.AllKeys.Where(where => where.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
            if (key != null)
            {
                if (queryString[key] == "undefined")
                {
                    return string.Empty;
                }
                else
                {
                    return HttpUtility.UrlDecode(queryString[key].Trim());
                }
            }
            else
            {
                return string.Empty;
            }
        }

        public static string ToJson(object obj)
        {
            return JsonConvert.SerializeObject(obj);
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
    }
}