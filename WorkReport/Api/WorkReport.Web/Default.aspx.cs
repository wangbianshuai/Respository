using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WorkReport.Web
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string html = string.Empty;

                if (this.Cache["IndexPage"] != null) html = this.Cache["IndexPage"].ToString();
                else
                {
                    using (TextReader reader = new StreamReader(this.Server.MapPath("index.html")))
                    {
                        html = reader.ReadToEnd();
                    }

                    this.Cache["IndexPage"] = html;
                }

                this.Response.Write(html);
            }
            catch (Exception ex)
            {
                this.Response.Write(ex.Message);
            }
        }
    }
}