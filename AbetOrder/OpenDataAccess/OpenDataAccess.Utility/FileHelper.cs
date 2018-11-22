using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace OpenDataAccess.Utility
{
    /// <summary>
    /// FileHelper 的摘要说明
    /// </summary>
    public class FileHelper
    {
        public static string Encrypt(string filename)
        {
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(filename);
            return HttpUtility.UrlEncode(Convert.ToBase64String(buffer));
        }

        public static string Encrypt(HttpRequest request, string filename)
        {
            byte[] buffer = request.ContentEncoding.GetBytes(filename);
            return HttpUtility.UrlEncode(Convert.ToBase64String(buffer));
        }

        public static string Encrypt(System.Text.Encoding encoding, string filename)
        {
            byte[] buffer = encoding.GetBytes(filename);
            return HttpUtility.UrlEncode(Convert.ToBase64String(buffer));
        }

        public static string Decrypt(string encryptfilename)
        {
            byte[] buffer = Convert.FromBase64String(encryptfilename);
            return System.Text.Encoding.UTF8.GetString(buffer);
        }

        public static string Decrypt(HttpRequest request, string encryptfilename)
        {
            byte[] buffer = Convert.FromBase64String(encryptfilename);
            return request.ContentEncoding.GetString(buffer);
        }
    }
}

