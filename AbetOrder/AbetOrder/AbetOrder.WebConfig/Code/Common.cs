using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace AbetOrder.WebConfig.Code
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

    }
}