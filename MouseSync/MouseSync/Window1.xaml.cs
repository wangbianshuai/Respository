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
    /// Window1.xaml 的交互逻辑
    /// </summary>
    public partial class Window1 : Window
    {
        public Window1()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            WebBroswer1.Navigate("http://news.baidu.com");
            WebBroswer2.Navigate("http://news.baidu.com");
        }

        public static int MakeLong(short lowPart, short highPart)
        {
            return (int)(((ushort)lowPart) | (uint)(highPart << 16));
        }
        public const int SB_THUMBTRACK = 5;
        public const int WM_HSCROLL = 0x114;
        public const int WM_VSCROLL = 0x115;
       // [DllImport("user32.dll", EntryPoint = "GetScrollInfo")]
      //  public static extern bool GetScrollInfo(IntPtr hwnd, int fnBar, ref SCROLLINFO lpsi);
        [DllImport("user32.dll", EntryPoint = "SetScrollInfo")]
        public static extern int SetScrollInfo(IntPtr hwnd, int fnBar, [In] ref SCROLLINFO lpsi, bool fRedraw);

        [DllImport("User32.dll", CharSet = CharSet.Auto, EntryPoint = "SendMessage")]
        static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
        [DllImport("user32.dll")]
        public static extern IntPtr PostMessage(IntPtr hWnd, int msg, int wParam, int lParam);

        private void Button1_Click(object sender, RoutedEventArgs e)
        {
            IntPtr hwnd = ((HwndSource)PresentationSource.FromVisual(WebBroswer1)).Handle;

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

            //int pos = GetScrollPos(hwnd, (int)ScrollBarDirection.SB_VERT);

            //SCROLLINFO si = new SCROLLINFO();
            //si.cbSize = (uint)Marshal.SizeOf(si);
            //si.fMask = (int)ScrollInfoMask.SIF_ALL;
            //bool result = GetScrollInfo(WebBroswer1.Handle, 1, ref si);
        }


        [DllImport("user32.dll", EntryPoint = "GetScrollPos")]
        public static extern int GetScrollPos(IntPtr hwnd, int nBar);

        [DllImport("user32.dll", EntryPoint = "GetScrollInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern bool GetScrollInfo(IntPtr hwnd, int fnBar, ref SCROLLINFO lpsi);

        [DllImport("user32.dll")]
        public static extern int SetScrollPos(IntPtr hwnd, int bar, int position, bool blRedraw);
    }

    public struct SCROLLINFO
    {
        public uint cbSize;
        public uint fMask;
        public int nMin;
        public int nMax;
        public uint nPage;
        public int nPos;
        public int nTrackPos;
    }
    enum ScrollInfoMask
    {
        SIF_RANGE = 0x1,
        SIF_PAGE = 0x2,
        SIF_POS = 0x4,
        SIF_DISABLENOSCROLL = 0x8,
        SIF_TRACKPOS = 0x10,
        SIF_ALL = (SIF_RANGE | SIF_PAGE | SIF_POS | SIF_TRACKPOS),
    }
    enum ScrollBarDirection
    {
        SB_HORZ = 0,
        SB_VERT = 1,
        SB_CTL = 2,
        SB_BOTH = 3
    }
}
