using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Component.Code.Data
{
    public static class ViewConfig
    {
        public static Dictionary<string, Dictionary<string, object>> DictionaryView = new Dictionary<string, Dictionary<string, object>>();

        static ViewConfig()
        {
            //LoadViewConfig();
        }

        public static void LoadViewConfig()
        {
            try
            {
                DictionaryView = new Dictionary<string, Dictionary<string, object>>();

                string path = System.Windows.Forms.Application.StartupPath;
                //if (Utility.AppSetting.IsDebug) path = path.Replace("\\bin\\Debug", string.Empty);
                path += "\\Component\\configs";

                string content = string.Empty;
                DirectoryInfo direct = new DirectoryInfo(path);
                direct.GetFiles().ToList().ForEach(file =>
                {
                    content = string.Empty;
                    using (TextReader reader = file.OpenText())
                    {
                        content = reader.ReadToEnd();
                    }

                    if (!string.IsNullOrEmpty(content))
                    {
                        DictionaryView.Add(file.Name.Replace(file.Extension, string.Empty), Utility.Common.JsonToDictionary(content));
                    }
                });

            }
            catch
            {
            }
        }

        public static Dictionary<string, object> GetView(string name)
        {
            if (DictionaryView.ContainsKey(name)) return DictionaryView[name];
            else throw new Exception(string.Format("未找到{0}视图配置！", name));
        }
    }
}
