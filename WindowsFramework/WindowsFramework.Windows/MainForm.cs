using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WindowsFramework.Windows
{
    public partial class MainForm : Form
    {
        public static bool IsInit = true;

        public MainForm()
        {
            InitializeComponent();

            if (IsInit) InitForm();
        }

        private void InitForm()
        {
            try
            {
                string rootPath = string.Concat(Application.StartupPath, "\\Component");
                Utility.Common.DeCompress(Utility.Common.GetHttpFileBytes(Utility.AppSetting.WebApiUrl), rootPath);

                System.Reflection.Assembly assembly = System.Reflection.Assembly.LoadFrom(string.Concat(rootPath, "\\WindowsFramework.Component.dll"));

                Type type = assembly.GetType("WindowsFramework.Component.MainForm");

                if (type != null)
                {
                    IsInit = false;
                    Activator.CreateInstance(type, this, string.Empty);
                }
                else
                {
                    MessageBox.Show("加载WindowsFramework.Component.MainForm类型失败！", "提示信息");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "提示信息");
            }
        }

    }
}
