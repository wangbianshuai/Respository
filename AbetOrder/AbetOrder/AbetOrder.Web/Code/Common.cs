using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace AbetOrder.Web.Code
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


        public static string GetParameterValue(HttpRequestMessage request, string name)
        {
            KeyValuePair<string, string> kvp = request.GetQueryNameValuePairs().Where(w => w.Key.ToLower() == name.ToLower()).FirstOrDefault();
            if (!string.IsNullOrEmpty(kvp.Value))
            {
                if (kvp.Value == "undefined")
                {
                    return string.Empty;
                }
                else
                {
                    return HttpUtility.UrlDecode(kvp.Value.Trim());
                }
            }

            return string.Empty;
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