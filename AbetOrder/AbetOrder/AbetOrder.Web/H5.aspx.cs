using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AbetOrder.Web
{
    public partial class H5 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string html = string.Empty;

                if (this.Cache["H5IndexPage"] != null) html = this.Cache["H5IndexPage"].ToString();
                else
                {
                    using (TextReader reader = new StreamReader(this.Server.MapPath("h5/index.html")))
                    {
                        html = reader.ReadToEnd();
                    }

                    this.Cache["H5IndexPage"] = html;
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