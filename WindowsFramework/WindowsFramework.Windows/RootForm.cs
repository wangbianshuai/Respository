using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFramework.Windows
{
    public partial class RootForm : Form
    {
        public RootForm()
        {
            InitializeComponent();

            SetForm();
           
            this.FormClosed += RootForm_FormClosed;
        }

        private void SetForm()
        {
            try
            {

                this.StartPosition = FormStartPosition.CenterScreen;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "提示信息");
                Code.LoggerProxy.WriteLog("Exception", "RootForm", "SetForm", null, ex);
            }
        }

        void RootForm_FormClosed(object sender, FormClosedEventArgs e)
        {
            if (this.DialogResult == System.Windows.Forms.DialogResult.Cancel)
            {
                System.Windows.Forms.Application.Exit();
            }
        }
    }
}
