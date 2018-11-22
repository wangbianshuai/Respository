using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Component.Code.Forms;

namespace WindowsFramework.Component
{
    public class MainForm
    {
        public IForm CurrentForm { get; set; }
        public System.Windows.Forms.Form _Form { get; set; }

        public MainForm(System.Windows.Forms.Form form, string name)
        {
            _Form = form;

            if (string.IsNullOrEmpty(name))
            {
                name = "Index";
                SetupLoad();
            }

            InitForm(name);
        }

        private void SetupLoad()
        {
            try
            {
                Code.Data.ViewConfig.LoadViewConfig();
            }
            catch (Exception ex)
            {
                Code.Utils.Common.Alert(ex.Message);
            }
        }

        private void InitForm(string name)
        {
            try
            {
                this.CurrentForm = this.GetForm(name);
                this._Form.Controls.AddRange(this.CurrentForm.GetControls().ToArray());
                this.CurrentForm.EventLoad();
                this.CurrentForm.DataLoad();
            }
            catch (Exception ex)
            {
                Code.Utils.Common.Alert(ex.Message);
            }
        }

        private IForm GetForm(string name)
        {
            switch (name)
            {
                case "Index": return new Index(this._Form);
                case "Login": return new Login(this._Form);
                case "UserManage": return new UserManage(this._Form);
                default: return new Login(this._Form);
            }
        }
    }
}
