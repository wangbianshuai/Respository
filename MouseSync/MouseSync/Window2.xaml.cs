using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace MouseSync
{
    /// <summary>
    /// Window2.xaml 的交互逻辑
    /// </summary>
    public partial class Window2 : Window
    {
        public Window2()
        {
            InitializeComponent();
        }
        Code.AxFramerControl _AxFramerControl;
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            Dictionary<string, object> _AxFramerOptions = new Dictionary<string, object>();
            _AxFramerOptions.Add("Name", "AxFramerControl1");

           _AxFramerControl = new Code.AxFramerControl(_AxFramerOptions);
            _AxFramerControl.InitAxFramerControl(WindowsFormsHost1);

            _AxFramerControl.OpenFile(AppDomain.CurrentDomain.BaseDirectory + "风险评估问卷CRM实体设计.docx");


        }

        private void Button1_Click(object sender, RoutedEventArgs e)
        {

            //Dictionary<string, object> _AxFramerOptions2 = new Dictionary<string, object>();
            //_AxFramerOptions2.Add("Name", "AxFramerControl2");

            //Code.AxFramerControl _AxFramerControl2 = new Code.AxFramerControl(_AxFramerOptions2);
            //_AxFramerControl2.InitAxFramerControl(WindowsFormsHost2);

            //_AxFramerControl2.OpenFile(AppDomain.CurrentDomain.BaseDirectory + "风险评估问卷CRM实体设计_1.docx");

            Microsoft.Office.Interop.Word.Document doc = _AxFramerControl.FramerControl.ActiveDocument as Microsoft.Office.Interop.Word.Document;

            List<IntPtr> list = new List<IntPtr>();
            Code.CallBack myCallBack = new Code.CallBack((h, p) =>
            {
                list.Add(h);
                return true;
            });
            Code.Win32Api.EnumWindows(myCallBack, doc.ActiveWindow.Hwnd);

            List<int> posList = new List<int>();
            List<SCROLLINFO> scrollInfoList = new List<SCROLLINFO>();

            list.ForEach(p =>
            {
                int pos = GetScrollPos(p, (int)ScrollBarDirection.SB_VERT);
                if (pos > 0) posList.Add(pos);

                SCROLLINFO si = new SCROLLINFO();
                si.cbSize = (uint)Marshal.SizeOf(si);
                si.fMask = (int)ScrollInfoMask.SIF_ALL;
                bool result = GetScrollInfo(p, 1, ref si);
                if (result) scrollInfoList.Add(si);
            });

            if (posList.Count > 0)
            {
            }
        }

        [DllImport("user32.dll", EntryPoint = "GetScrollPos")]
        public static extern int GetScrollPos(IntPtr hwnd, int nBar);

        [DllImport("user32.dll", EntryPoint = "GetScrollInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern bool GetScrollInfo(IntPtr hwnd, int fnBar, ref SCROLLINFO lpsi);

        [DllImport("user32.dll")]
        public static extern int SetScrollPos(IntPtr hwnd, int bar, int position, bool blRedraw);

        [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        public static extern IntPtr GetForegroundWindow();
    }
}
