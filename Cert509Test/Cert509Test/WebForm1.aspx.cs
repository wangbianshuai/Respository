using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Cert509Test
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //RSA测试实例
            string oldData = "taiyonghai";
            Common.CreateRSAKey();
            string ciphertext = Common.RSAEncrypt(oldData);
            string newData = Common.RSADecrypt(ciphertext);
        }
    }
}