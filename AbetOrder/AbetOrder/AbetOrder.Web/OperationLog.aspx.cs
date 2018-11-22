using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AbetOrder.Web
{
    public partial class OperationLog : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string path = this.Request.QueryString["Path"];

                path = this.Server.MapPath(path);

                if (File.Exists(path))
                {
                    using (TextReader reader = new StreamReader(path))
                    {
                        StringBuilder sb = new StringBuilder();
                        sb.AppendLine("<html>");
                        sb.AppendLine("<head>");
                        sb.AppendLine("<title>操作日志</title>");
                        sb.AppendLine("</head>");
                        sb.AppendLine("<body>");
                        string content = reader.ReadToEnd();
                        content = content.Replace("\n", "</br>");
                        sb.AppendLine("<div>");
                        sb.AppendLine(content);
                        sb.AppendLine("</div>");
                        sb.AppendLine("</body>");
                        sb.AppendLine("</html>");
                        this.Response.Write(sb.ToString());
                    }
                }
                else
                {
                    this.Response.Write("文本不存在！");
                }
            }
            catch (Exception ex)
            {
                this.Response.Write(ex.Message);
            }
        }
    }
}