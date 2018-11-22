using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Forms
{
    public class Login : BaseForm, IForm
    {
        Action.IUser _user;

        public Login(System.Windows.Forms.Form form)
        {
            _Form = form;
            _View = Code.Data.ViewConfig.GetView("Login");
            _user = new Action.Impl.User();

            this.SetForm();
        }

        public override void EventInvoke(object sender, EventArgs e, Controls.IControl control)
        {
            string name = control.GetProperty().GetStringValue("Name");
            switch (name)
            {
                case "Login": UserLogin(sender, e, control); break;
            }
        }

        private void UserLogin(object sender, EventArgs e, Controls.IControl control)
        {
            string message = string.Empty;
            Dictionary<string, object> dict = this.GetEditData(out message);
            if (!string.IsNullOrEmpty(message))
            {
                Utils.Common.Alert(message);
                return;
            }

            Entity.Action.User.LoginRequest request = new Entity.Action.User.LoginRequest();
            request.LoginName = dict.GetStringValue("LoginName");
            request.LoginPasword = Common.ComputeStringMd5(dict.GetStringValue("LoginPassword"));
            Entity.Action.User.LoginResponse resposne = _user.Login(request);
            if (resposne.Ack.IsSuccess)
            {
                Data.Cache.LoginUser = Common.MapTo<Model.User>(resposne);

                this._Form.DialogResult = System.Windows.Forms.DialogResult.OK;
                this._Form.Close();
            }
            else
            {
                Utils.Common.Alert(resposne.Ack.StatusMessage);
            }
        }

        public override void EventLoad()
        {
            base.EventLoad();

            this._Form.FormClosed += _Form_FormClosed;
        }

        void _Form_FormClosed(object sender, System.Windows.Forms.FormClosedEventArgs e)
        {
            if (this._Form.DialogResult == System.Windows.Forms.DialogResult.Cancel)
            {
                System.Windows.Forms.Application.Exit();
            }
        }
    }
}
