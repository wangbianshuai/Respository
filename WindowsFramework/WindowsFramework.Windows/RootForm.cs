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

            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormClosed += RootForm_FormClosed;
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
