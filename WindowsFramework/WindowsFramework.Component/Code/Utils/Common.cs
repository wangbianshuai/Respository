using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Component.Code.Utils
{
    public class Common
    {
        /// <summary>
        /// 弹出对话框
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static System.Windows.Forms.DialogResult Alert(string message)
        {
            return System.Windows.Forms.MessageBox.Show(message, "提示信息");
        }
    }
}
