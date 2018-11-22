using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Forms
{
    public class Index : BaseForm, IForm
    {
        public Index(System.Windows.Forms.Form form)
        {
            _Form = form;
            _View = Code.Data.ViewConfig.GetView("Index");

            this.SetForm();

            this.LoadLoginForm();
        }

        private void LoadLoginForm()
        {
            this._Form.Hide();
            MainForm loginForm = new MainForm(this.GetNewForm(), "Login");
            loginForm.CurrentForm.ParentForm = this._Form;

            if (loginForm._Form.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                this._Form.Show();
            }
        }

        public override void EventInvoke(object sender, EventArgs e, Controls.IControl control)
        {
            string name = control.GetProperty().GetStringValue("Name");
            switch (name)
            {
                case "UserManage": SetUserManage(sender, e, control); break;
            }
        }

        private void SetUserManage(object sender, EventArgs e, Controls.IControl control)
        {
            MainForm _UserManage = new MainForm(this.GetNewForm(), "UserManage");
            _UserManage.CurrentForm.ParentForm = this._Form;

            if (_UserManage._Form.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            { 
            }

        }
    }
}
