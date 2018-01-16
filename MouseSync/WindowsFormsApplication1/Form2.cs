using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            int msg = 0x115;
            //SendMessage(richTextBox1.Handle, msg, 3, IntPtr.Zero);
            //SendMessage(richTextBox1.Handle, msg, 3, IntPtr.Zero);
            //SendMessage(richTextBox1.Handle, msg, 3, IntPtr.Zero);

            //SendMessage(richTextBox2.Handle, msg, 3, IntPtr.Zero);
            //SendMessage(richTextBox2.Handle, msg, 3, IntPtr.Zero);
        
            //SetScrollPos(richTextBox1.Handle, 1, 200, 1);
    
            SCROLLINFO lpsi = new SCROLLINFO();
            GetScrollInfo(richTextBox1.Handle, 1, ref lpsi);

            int MINWIDTH = 200;
            int BORDERWIDTH = SystemInformation.Border3DSize.Width;
            int SCROLLBARWIDTH = SystemInformation.VerticalScrollBarWidth;

            SCROLLINFO si = new SCROLLINFO();
            si.cbSize = (uint)Marshal.SizeOf(si);
            si.fMask = (int)ScrollInfoMask.SIF_ALL;
            bool result= GetScrollInfo(richTextBox1.Handle, 1, ref si);

            int iWidth = si.nMax - si.nMin + 2 * BORDERWIDTH + SCROLLBARWIDTH + 2;
            //return Math.Max(MINWIDTH, iWidth);
            //SetScrollPos(richTextBox2.Handle, 1, si.nPos, 1);
           
           SetScrollInfo(richTextBox2.Handle, 1, ref si, true);

            Win32.SCROLLINFO info = new Win32.SCROLLINFO();
            info.cbSize = (uint)Marshal.SizeOf(info);
            info.fMask = (int)Win32.ScrollInfoMask.SIF_ALL;
            info.nPos = si.nPos;

            //Win32.Win32API2.SetScrollInfo(richTextBox2.Handle, (int)Win32.ScrollBarDirection.SB_VERT, ref info, true);

            Win32.Win32API2.PostMessage(richTextBox2.Handle, Win32.Win32API2.WM_VSCROLL, Win32.Win32API2.MakeLong((short)Win32.Win32API2.SB_THUMBTRACK, (short)(si.nPos)), 0);

            int lp = Convert.ToInt32(si.nPos * si.nPage / si.nMax);
            for (var i = 0; i < lp; i++)
            {
                //SendMessage(richTextBox2.Handle, msg, 1, IntPtr.Zero);
            }

            int pos = GetScrollPos(richTextBox1.Handle, 1);

            Lordeo.Framework.SCROLLINFO si2 = new Lordeo.Framework.SCROLLINFO();
            si2.cbSize =(uint) Marshal.SizeOf(si);
            si2.fMask = (int)ScrollInfoMask.SIF_TRACKPOS;
            si2.nPos = 200;

          // Lordeo.Framework.Win32API.SetScrollInfo(richTextBox1.Handle, 1, ref si2, 1);

            //bool r = SetScrollRange(richTextBox1.Handle, 1, 500, true);
        }

        [DllImport("User32.dll", EntryPoint = "ScrollWindow")]
        public static extern int ScrollWindow(IntPtr hWnd, int XAmount, int YAmount, IntPtr IpRect, IntPtr lpClipRect);


        [DllImport("user32.dll")]
        public static extern int SetScrollInfo(IntPtr hwnd, int fnBar, ref SCROLLINFO lpsi, bool fRedraw);
 
        [DllImport("user32.dll")]
        public static extern bool SetScrollRange(IntPtr hWnd, int nBar, int nMinPos, int nMaxPos, bool bRedraw);

        [DllImport("user32.dll")]
        static extern int SendMessage(IntPtr hwnd, int msg, int lp, IntPtr rp);

        [DllImport("user32.dll")]
        static extern int SetScrollPos(IntPtr hwnd, int bar, int position, int redraw);

        [DllImport("user32.dll", EntryPoint = "GetScrollPos")]
        public static extern int GetScrollPos(IntPtr hwnd, int nBar);

        [DllImport("user32.dll", EntryPoint = "GetScrollInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern bool GetScrollInfo(IntPtr hwnd, int fnBar, ref SCROLLINFO lpsi);

        int MAKELPARAM(int wLow, int wHigh)
        {
            return wHigh * 0x10000 + wLow;
        }
    }

    //http://blog.csdn.net/ghevinn/article/details/45057385
    /// <summary>
    /// http://www.360doc.com/content/10/1118/11/4573653_70358985.shtml
    /// </summary>

    [Serializable, StructLayout(LayoutKind.Sequential)]
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

    public enum ScrollInfoMask : uint
    {
        SIF_RANGE = 0x1,
        SIF_PAGE = 0x2,
        SIF_POS = 0x4,
        SIF_DISABLENOSCROLL = 0x8,
        SIF_TRACKPOS = 0x10,
        SIF_ALL = (SIF_RANGE | SIF_PAGE | SIF_POS | SIF_TRACKPOS),
    }   
}
