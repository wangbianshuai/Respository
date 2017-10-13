using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFramework.Test
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();

          
            this.Controls.Add(new GroupBox() { Dock = DockStyle.Fill, Text = "Fill", TabIndex = 2, Location = new System.Drawing.Point(0, 100), Size= new System.Drawing.Size(836, 290) });
            this.Controls.Add(new GroupBox() { Dock = DockStyle.Top, Height = 100, Text = "Top", TabIndex = 1 });
        }
    }
}
