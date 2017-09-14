using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OpenDataFramework.WebApi
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }


        protected void Button1_Click(object sender, EventArgs e)
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                sb.Append(GetFilesContent("Web/js/1_utils"));
                sb.Append(GetFilesContent("Web/js/2_api"));
                sb.Append(GetFilesContent("Web/js/3_data"));
                sb.Append(GetFilesContent("Web/js/4_actions"));
                sb.Append(GetFilesContent("Web/js/5_controls"));
                sb.Append(GetFilesContent("Web/js/6_components"));
                sb.Append(GetFilesContent("Web/js/7_layouts"));
                sb.Append(GetFilesContent("Web/js/8_pages"));


                this.textarea1.Value = sb.ToString();
            }
            catch (Exception ex)
            {
                this.textarea1.Value = ex.Message;
            }
        }

        private string GetFilesContent(string path)
        {
            StringBuilder sb = new StringBuilder();

            path = this.Server.MapPath(path);
            DirectoryInfo direct = new DirectoryInfo(path);
            direct.GetFiles().ToList().OrderBy(b => int.Parse(b.Name.Split('_')[0])).ToList().ForEach(file =>
            {
                using (TextReader reader = file.OpenText())
                {
                    sb.Append(reader.ReadToEnd());
                    sb.Append("\n");
                }
            });

            return sb.ToString();
        }

        protected void Button2_Click(object sender, EventArgs e)
        {
            try
            {
                this.textarea1.Value = GetFilesContent("Web/css");
            }
            catch (Exception ex)
            {
                this.textarea1.Value = ex.Message;
            }
        }

        public string RemoveEnterOrWhiteSpace(string str)
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
    }
}