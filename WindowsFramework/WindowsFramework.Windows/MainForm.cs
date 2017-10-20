using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WindowsFramework.Windows
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();

            ShowRootForm();
        }

        private void ShowRootForm()
        {
            try
            {
                this.Hide();
                RootForm root = new RootForm();

                if (root.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                {
                    InitForm();
                }

                Code.GetVersionResponse response = this.GetVersion();

                Code.DefaultConfig config = GetDefaultConfig();

                config = config ?? new Code.DefaultConfig();

                bool blChanged = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "提示信息");
                Code.LoggerProxy.WriteLog("Exception", "MainForm", "ShowRootForm", null, ex);
            }
        }

        private Code.GetVersionResponse GetVersion()
        {
            string url = Utility.AppSetting.WebApiUrl + "api/app/getversion";
            return Code.RequestService.PostRequestTo<Code.GetVersionResponse>(url, null);
        }

        private Code.DefaultConfig GetDefaultConfig()
        {
            string path = Application.StartupPath + "\\configs\\Default.json";

            string content = string.Empty;

            using (TextReader reader = new StreamReader(path))
            {
                content = reader.ReadToEnd();
            }

            if (string.IsNullOrEmpty(content)) return null;

            return JsonConvert.DeserializeObject<Code.DefaultConfig>(content);
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
