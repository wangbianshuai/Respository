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
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        //结构体布局 本机位置
        [StructLayout(LayoutKind.Sequential)]
        struct NativeRECT
        {
            public int left;
            public int top;
            public int right;
            public int bottom;
        }

        //将枚举作为位域处理
        [Flags]
        enum MouseEventFlag : uint //设置鼠标动作的键值
        {
            Move = 0x0001,               //发生移动
            LeftDown = 0x0002,           //鼠标按下左键
            LeftUp = 0x0004,             //鼠标松开左键
            RightDown = 0x0008,          //鼠标按下右键
            RightUp = 0x0010,            //鼠标松开右键
            MiddleDown = 0x0020,         //鼠标按下中键
            MiddleUp = 0x0040,           //鼠标松开中键
            XDown = 0x0080,
            XUp = 0x0100,
            Wheel = 0x0800,              //鼠标轮被移动
            VirtualDesk = 0x4000,        //虚拟桌面
            Absolute = 0x8000
        }

        //设置鼠标位置
        [DllImport("user32.dll")]
        static extern bool SetCursorPos(int X, int Y);

        //设置鼠标按键和动作
        [DllImport("user32.dll")]
        static extern void mouse_event(MouseEventFlag flags, int dx, int dy,
            uint data, UIntPtr extraInfo); //UIntPtr指针多句柄类型

        [DllImport("user32.dll")]
        static extern IntPtr FindWindow(string strClass, string strWindow);

        //该函数获取一个窗口句柄,该窗口雷鸣和窗口名与给定字符串匹配 hwnParent=Null从桌面窗口查找
        [DllImport("user32.dll")]
        static extern IntPtr FindWindowEx(IntPtr hwndParent, IntPtr hwndChildAfter,
            string strClass, string strWindow);

        [DllImport("user32.dll")]
        static extern bool GetWindowRect(HandleRef hwnd, out NativeRECT rect);

        //定义变量
        const int AnimationCount = 80;
        private Point endPosition;
        private int count;

        private void button1_Click(object sender, EventArgs e)
        {
            NativeRECT rect;
            //获取主窗体句柄
            IntPtr ptrTaskbar = FindWindow("WindowsForms10.Window.8.app.0.2bf8098_r11_ad1", null);
            if (ptrTaskbar == IntPtr.Zero)
            {
                MessageBox.Show("No windows found!");
                return;
            }
            //获取窗体中"button1"按钮
            IntPtr ptrStartBtn = FindWindowEx(ptrTaskbar, IntPtr.Zero, null, "button1");
            if (ptrStartBtn == IntPtr.Zero)
            {
                MessageBox.Show("No button found!");
                return;
            }
            //获取窗体大小
            GetWindowRect(new HandleRef(this, ptrStartBtn), out rect);
            endPosition.X = (rect.left + rect.right) / 2;
            endPosition.Y = (rect.top + rect.bottom) / 2;
            //判断点击按钮
            if (checkBox1.Checked)
            {
                //选择"查看鼠标运行的轨迹"
                this.count = AnimationCount;
                movementTimer.Start();
            }
            else
            {
                SetCursorPos(endPosition.X, endPosition.Y);
                mouse_event(MouseEventFlag.LeftDown, 0, 0, 0, UIntPtr.Zero);
                mouse_event(MouseEventFlag.LeftUp, 0, 0, 0, UIntPtr.Zero);
                textBox1.Text = String.Format("{0},{1}", MousePosition.X, MousePosition.Y);
            }

        }

        //Tick:定时器,每当经过多少时间发生函数
        private void movementTimer_Tick(object sender, EventArgs e)
        {
            int stepx = (endPosition.X - MousePosition.X) / count;
            int stepy = (endPosition.Y - MousePosition.Y) / count;
            count--;
            if (count == 0)
            {
                movementTimer.Stop();
                mouse_event(MouseEventFlag.LeftDown, 0, 0, 0, UIntPtr.Zero);
                mouse_event(MouseEventFlag.LeftUp, 0, 0, 0, UIntPtr.Zero);
            }
            textBox1.Text = String.Format("{0},{1}", MousePosition.X, MousePosition.Y);
            mouse_event(MouseEventFlag.Move, stepx, stepy, 0, UIntPtr.Zero);
        }
    }
}
