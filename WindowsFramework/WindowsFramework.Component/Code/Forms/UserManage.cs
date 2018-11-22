using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Forms
{
    public class UserManage : BaseForm, IForm
    {
        public UserManage(System.Windows.Forms.Form form)
        {
            _Form = form;
            _View = Code.Data.ViewConfig.GetView("UserManage");

            this.SetForm();
        }

        public override void EventInvoke(object sender, EventArgs e, Controls.IControl control)
        {
            string name = control.GetProperty().GetStringValue("Name");
            switch (name)
            {
                case "Query": Query(sender, e, control); break;
                case "Add": Add(sender, e, control); break;
            }
        }

        private void Query(object sender, EventArgs e, Controls.IControl control)
        {
          
        }

        private void Add(object sender, EventArgs e, Controls.IControl control)
        {
        }
    }
}
