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
            SendMessage(richTextBox1.Handle, msg, 3, IntPtr.Zero);
            SendMessage(richTextBox1.Handle, msg, 3, IntPtr.Zero);
            SendMessage(richTextBox1.Handle, msg, 3, IntPtr.Zero);

            //SetScrollPos(richTextBox1.Handle, 1, 200, 1);
        }

        [DllImport("user32.dll")]
        static extern int SendMessage(IntPtr hwnd, int msg, int lp, IntPtr rp);

        [DllImport("user32.dll")]
        static extern int SetScrollPos(IntPtr hwnd, int bar, int position, int redraw);

        [DllImport("user32.dll", EntryPoint = "GetScrollInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern bool GetScrollInfo(IntPtr hwnd, int fnBar, ref SCROLLINFO lpsi);


        [DllImport("user32.dll", EntryPoint = "SetScrollInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern int SetScrollInfo(IntPtr hwnd, int fnBar, [In] ref SCROLLINFO lpsi, bool fRedraw);
    }

    //http://blog.csdn.net/ghevinn/article/details/45057385
    /// <summary>
    /// http://www.360doc.com/content/10/1118/11/4573653_70358985.shtml
    /// </summary>
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
}
