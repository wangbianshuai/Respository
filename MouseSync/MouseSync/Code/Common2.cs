using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace MouseSync.Code
{
    public class Common2
    {
        public static int PanelZIndex = 1000;

        public static int GetPanelZIndex()
        {
            PanelZIndex += 1;
            return PanelZIndex;
        }

        /// <summary>
        /// 弹出对话框
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static System.Windows.MessageBoxResult Alert(string entityName, string methodName, Exception ex)
        {
            ex = Common.GetInnerException(ex);
            LoggerProxy.Exception(entityName, methodName, ex);
            return System.Windows.MessageBox.Show(ex.Message, "提示信息");
        }

        public static System.Windows.MessageBoxResult Alert(string entityName, string methodName, string message, Exception ex)
        {
            ex = Common.GetInnerException(ex);
            LoggerProxy.Exception(entityName, methodName, ex);
            return System.Windows.MessageBox.Show(message, "提示信息");
        }

        public static System.Windows.MessageBoxResult Alert(string message)
        {
            return System.Windows.MessageBox.Show(message, "提示信息");
        }

        public static System.Windows.MessageBoxResult Confrim(string message)
        {
            return System.Windows.MessageBox.Show(message, "确认信息", System.Windows.MessageBoxButton.OKCancel);
        }

        public static System.Drawing.Color GetDrawingColor(string color)
        {
            return System.Drawing.ColorTranslator.FromHtml(color);
        }

        public static System.Windows.Media.Stretch GetStretch(string value)
        {
            switch (value)
            {
                case "Fill": return System.Windows.Media.Stretch.Fill;
                case "Uniform": return System.Windows.Media.Stretch.Uniform;
                case "UniformToFill": return System.Windows.Media.Stretch.UniformToFill;
                default: return System.Windows.Media.Stretch.None;
            }
        }

        public static void SetProperty(Dictionary<string, object> dict, string name, Dictionary<string, object> property)
        {
            Dictionary<string, object> dict2 = GetProperty(dict, name);
            if (dict2 != null) foreach (var kvp in property) dict2[kvp.Key] = kvp.Value;
        }

        public static void SetProperty(Dictionary<string, object> dict, string key, string name, object value)
        {
            Dictionary<string, object> dict2 = GetProperty(dict, key);
            if (dict2 != null) dict2[name] = value;
        }

        public static Dictionary<string, object> GetProperty(Dictionary<string, object> dict, string name)
        {
            if (dict != null && dict.ContainsKey("Name") && dict["Name"].ToString() == name) return dict;

            Dictionary<string, object> property = null;
            foreach (var kvp in dict)
            {
                if (kvp.Value is Dictionary<string, object>)
                {
                    property = GetProperty(kvp.Value as Dictionary<string, object>, name);
                    if (property != null) return property;
                }
                else if (kvp.Value is List<Dictionary<string, object>>)
                {
                    foreach (var d in kvp.Value as List<Dictionary<string, object>>)
                    {
                        property = GetProperty(d, name);
                        if (property != null) return property;
                    }
                }
            }

            return property;
        }

        public static System.Windows.VerticalAlignment GetVerticalAlignment(string value)
        {
            switch (value)
            {
                case "Bottom": return System.Windows.VerticalAlignment.Bottom;
                case "Center": return System.Windows.VerticalAlignment.Center;
                case "Stretch": return System.Windows.VerticalAlignment.Stretch;
                default: return System.Windows.VerticalAlignment.Top;
            }
        }

        public static System.Windows.HorizontalAlignment GetHorizontalAlignment(string value)
        {
            switch (value)
            {
                case "Center": return System.Windows.HorizontalAlignment.Center;
                case "Right": return System.Windows.HorizontalAlignment.Right;
                case "Stretch": return System.Windows.HorizontalAlignment.Stretch;
                default: return System.Windows.HorizontalAlignment.Left;
            }
        }

        public static System.Windows.Media.SolidColorBrush GetColor(string value, int opacity = 0)
        {
            var color = new System.Windows.Media.SolidColorBrush(Common.GetColor((string)value));
            if (opacity > 0) color.Opacity = opacity / 100;
            return color;
        }


        public static System.Windows.Media.ImageSource GetImage(string url)
        {
            if (url.ToLower().StartsWith("http"))
            {
                System.Windows.Media.ImageSourceConverter imageSourceConverter = new System.Windows.Media.ImageSourceConverter();
                System.IO.Stream stream = Common.GetImageStream(url);
                if (stream == null) return null;
                return (System.Windows.Media.ImageSource)new System.Windows.Media.ImageSourceConverter().ConvertFrom(stream);
            }
            else
            {
                url = AppDomain.CurrentDomain.BaseDirectory + url.Replace("/", "\\");
                return (System.Windows.Media.ImageSource)new System.Windows.Media.ImageSourceConverter().ConvertFrom(File.ReadAllBytes(url));
            }
        }

        public static System.Drawing.Image GetDrawingImage(string url)
        {
            if (url.ToLower().StartsWith("http"))
            {
                return Common.GetImage(url);
            }
            else
            {
                return System.Drawing.Image.FromFile(url);
            }
        }

        public static System.Windows.Media.ImageSource GetImageSource(System.IO.Stream stream)
        {
            System.Windows.Media.ImageSourceConverter imageSourceConverter = new System.Windows.Media.ImageSourceConverter();
            if (stream == null) return null;
            return (System.Windows.Media.ImageSource)new System.Windows.Media.ImageSourceConverter().ConvertFrom(stream);
        }

        public static System.Windows.Media.ImageSource GetImageSource(byte[] bs)
        {
            System.Windows.Media.ImageSourceConverter imageSourceConverter = new System.Windows.Media.ImageSourceConverter();
            if (bs == null) return null;
            return (System.Windows.Media.ImageSource)new System.Windows.Media.ImageSourceConverter().ConvertFrom(bs);
        }

        public static void SaveFile(MemoryStream ms, string fileName)
        {
            SaveFile(ms.ToArray(), fileName);
        }

        public static void SaveFile(byte[] bytes, string fileName)
        {
            using (FileStream fs = new FileStream(fileName, FileMode.Create, FileAccess.Write))
            {
                fs.Write(bytes, 0, bytes.Length);
                fs.Close();
            }
        }

        public static string GetTextContent(string fileName)
        {
            byte[] bs = File.ReadAllBytes(fileName);
            System.Text.Encoding encoding = System.Text.Encoding.Default;

            using (System.IO.BinaryReader br = new System.IO.BinaryReader(new MemoryStream(bs)))
            {
                byte[] buffer = br.ReadBytes(2);

                if (buffer[0] >= 0xEF)
                {
                    if (buffer[0] == 0xEF && buffer[1] == 0xBB) encoding = System.Text.Encoding.UTF8;
                    else if (buffer[0] == 0xFE && buffer[1] == 0xFF) encoding = System.Text.Encoding.BigEndianUnicode;
                    else if (buffer[0] == 0xFF && buffer[1] == 0xFE) encoding = System.Text.Encoding.Unicode;
                }
            }

            using (TextReader reader = new StreamReader(new MemoryStream(bs), encoding))
            {
                return reader.ReadToEnd();
            }
        }

        public static List<T> FindVisualChildList<T>(System.Windows.DependencyObject obj) where T : System.Windows.DependencyObject
        {
            List<T> list = new List<T>();
            for (int i = 0; i < System.Windows.Media.VisualTreeHelper.GetChildrenCount(obj); i++)
            {
                System.Windows.DependencyObject child = System.Windows.Media.VisualTreeHelper.GetChild(obj, i);

                if (child != null)
                {
                    if (child is T) list.Add((T)child);
                    else list.AddRange(FindVisualChildList<T>(child));
                }
            }
            return list;
        }

        public static string GetTemplateXamlCode(Control ctrl)
        {
            System.Windows.FrameworkTemplate template = ctrl.Template;

            string xaml = "";

            if (template != null)
            {

                System.Xml.XmlWriterSettings settings = new System.Xml.XmlWriterSettings();
                settings.Indent = true;
                settings.IndentChars = new string(' ', 4);
                settings.NewLineOnAttributes = true;

                StringBuilder strbuild = new StringBuilder();
                System.Xml.XmlWriter xmlwrite = System.Xml.XmlWriter.Create(strbuild, settings);

                try
                {
                    System.Windows.Markup.XamlWriter.Save(template, xmlwrite);
                    xaml = strbuild.ToString();
                }
                catch (Exception exc)
                {
                    xaml = exc.Message;
                }
            }
            else
            {
                xaml = "no template";
            }

            return xaml;
        }

        public static string GetFileSize(string fileName)
        {
            FileInfo fi = new FileInfo(fileName);

            if (fi.Length < 1000) return string.Format("{0}B", fi.Length);

            decimal k = (decimal)fi.Length / (decimal)1024;
            if (k < 1000) return string.Format("{0}K", decimal.Round(k, 2).ToString());

            k = k / 1024;
            if (k < 1000) return string.Format("{0}M", decimal.Round(k, 2).ToString());

            k = k / 1024;
            return string.Format("{0}G", decimal.Round(k, 2).ToString());
        }

        public static void CopyFile(string fileName, string saveFileName, string dir)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory;

            path = string.Format("{0}{1}", path, dir.Replace("/", "\\"));

            if (!Directory.Exists(path)) Directory.CreateDirectory(path);

            path += "\\" + saveFileName;

            FileInfo myfile = new FileInfo(fileName);
            myfile.CopyTo(path, true);
        }

        public static string GetPath(string dir)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory;

            return string.Format("{0}{1}", path, dir.Replace("/", "\\"));
        }

        /// <summary>
        /// 获取文件路径
        /// </summary>
        /// <param name="dir"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static string GetFilePath(string dirPath, string fileName)
        {
            dirPath = InitDirPath(dirPath);
            return string.Format("{0}\\{1}", dirPath, fileName);
        }

        public static void DeleteFile(string fileName)
        {
            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory;

                path = string.Format("{0}{1}", path, fileName.Replace("/", "\\"));

                if (File.Exists(path)) File.Delete(path);
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("Common", "DeleteFile", ex);
            }
        }


        public static byte[] CaptureScreen(int x, int y, int w, int h)
        {
            MemoryStream ms = new MemoryStream();

            System.Drawing.Imaging.EncoderParameters ep = new System.Drawing.Imaging.EncoderParameters();
            ep.Param[0] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.Quality, new long[] { 100 });

            System.Drawing.Imaging.ImageCodecInfo imageCodecInfo = System.Drawing.Imaging.ImageCodecInfo.GetImageEncoders().Where(where => where.FormatDescription.Equals("PNG")).FirstOrDefault();

            using (System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(w, h))
            {
                bitmap.MakeTransparent();

                using (System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bitmap))
                {
                    g.CopyFromScreen(new System.Drawing.Point(x, y), System.Drawing.Point.Empty, bitmap.Size);
                }

                bitmap.Save(ms, imageCodecInfo, ep);
            }

            return ms.ToArray();
        }

        /// <summary>
        /// 初始化目录路径
        /// </summary>
        public static string InitDirPath(string dirPath)
        {
            dirPath = Common2.GetPath(dirPath);
            if (!Directory.Exists(dirPath)) Directory.CreateDirectory(dirPath);
            return dirPath;
        }
    }
}
