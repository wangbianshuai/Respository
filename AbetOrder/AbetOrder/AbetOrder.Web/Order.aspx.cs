using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AbetOrder.Web
{
    public partial class Order : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string name = this.Request.QueryString["Name"];

                string path = string.Empty;

                if (name == "B17DC2B1-AF38-4C79-AAE3-3C784CAC6F98") path = "html/Order1.html";
                else if (name == "B395A96C-C7D3-4597-862B-8B717BBCC200") path = "html/ProcessOrder1.html";

                string html = string.Empty;

                using (TextReader reader = new StreamReader(this.Server.MapPath(path)))
                {
                    html = reader.ReadToEnd();
                }

                html = html.Replace("${Version}", "98498749845");
                //html = html.Replace("${Version}", Guid.NewGuid().ToString().Substring(0, 8));

                this.Response.Write(html);
            }
            catch (Exception ex)
            {
                this.Response.Write(ex.Message);
            }
        }
    }
}