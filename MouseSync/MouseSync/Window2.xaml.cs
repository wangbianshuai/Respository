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

        Code.AxAcroPDF _AxAcroPDF { get; set; }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
           // Dictionary<string, object> _AxFramerOptions = new Dictionary<string, object>();
           // _AxFramerOptions.Add("Name", "AxFramerControl1");

           //_AxFramerControl = new Code.AxFramerControl(_AxFramerOptions);
           // _AxFramerControl.InitAxFramerControl(WindowsFormsHost1);

           // _AxFramerControl.OpenFile(AppDomain.CurrentDomain.BaseDirectory + "风险评估问卷CRM实体设计.docx");

            try
            {
                Dictionary<string, object> _AxAcroPDFOptions = new Dictionary<string, object>();
                _AxAcroPDFOptions.Add("Name", "AxAcroPDFOptions1");

                _AxAcroPDF = new Code.AxAcroPDF(_AxAcroPDFOptions);
                _AxAcroPDF.InitAxFramerControl(WindowsFormsHost1);

                _AxAcroPDF.OpenFile(AppDomain.CurrentDomain.BaseDirectory + "麦肯锡精英的48个工作习惯10.pdf");
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void Button1_Click(object sender, RoutedEventArgs e)
        {

            //Dictionary<string, object> _AxFramerOptions2 = new Dictionary<string, object>();
            //_AxFramerOptions2.Add("Name", "AxFramerControl2");

            //Code.AxFramerControl _AxFramerControl2 = new Code.AxFramerControl(_AxFramerOptions2);
            //_AxFramerControl2.InitAxFramerControl(WindowsFormsHost2);

            //_AxFramerControl2.OpenFile(AppDomain.CurrentDomain.BaseDirectory + "风险评估问卷CRM实体设计_1.docx");

            //Microsoft.Office.Interop.Word.Document doc = _AxFramerControl.FramerControl.ActiveDocument as Microsoft.Office.Interop.Word.Document;

            List<IntPtr> list = new List<IntPtr>();
            Code.CallBack myCallBack = new Code.CallBack((h, p) =>
            {
                list.Add(h);
                return true;
            });
            Code.Win32Api.EnumWindows(myCallBack, 0);

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

            SCROLLINFO si2 = new SCROLLINFO();
            si2.cbSize = (uint)Marshal.SizeOf(si2);
            si2.fMask = (int)ScrollInfoMask.SIF_ALL;
            bool result2 = GetScrollInfo(_AxAcroPDF.AcroPDF.Handle, 1, ref si2);
            if (result2) scrollInfoList.Add(si2);

            PostMessage(_AxAcroPDF.AcroPDF.Handle, WM_VSCROLL, MakeLong((short)SB_THUMBTRACK, (short)(100)), 0);

            this._AxAcroPDF.AcroPDF.Focus();
            mouse_event(MOUSEEVENTF_WHEEL, 0, 0, -100, 0);
            mouse_event(MOUSEEVENTF_WHEEL, 0, 0, -100, 0);
        }

        const int MOUSEEVENTF_WHEEL = 0x800;

        [DllImport("user32.dll", EntryPoint = "GetScrollPos")]
        public static extern int GetScrollPos(IntPtr hwnd, int nBar);

        [DllImport("user32.dll", EntryPoint = "GetScrollInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern bool GetScrollInfo(IntPtr hwnd, int fnBar, ref SCROLLINFO lpsi);

        [DllImport("user32.dll")]
        public static extern int SetScrollPos(IntPtr hwnd, int bar, int position, bool blRedraw);

        [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        public static extern IntPtr GetForegroundWindow();

        public static int MakeLong(short lowPart, short highPart)
        {
            return (int)(((ushort)lowPart) | (uint)(highPart << 16));
        }
        public const int SB_THUMBTRACK = 5;
        public const int WM_HSCROLL = 0x114;
        public const int WM_VSCROLL = 0x115;

        [DllImport("User32.dll", CharSet = CharSet.Auto, EntryPoint = "SendMessage")]
        static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern IntPtr PostMessage(IntPtr hWnd, int msg, int wParam, int lParam);

        [DllImport("user32.dll")]
        static extern void mouse_event(int flags, int dX, int dY, int buttons, int extraInfo);

    }
}
