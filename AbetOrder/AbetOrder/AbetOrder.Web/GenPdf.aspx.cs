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
    public partial class GenPdf : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Component.Order order = new Component.Order();
            order.GenPdf(Guid.Parse("061135d5-021f-4c1e-b07c-511fd3a73f5f"), 1);
        }
    }
}