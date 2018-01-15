using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MouseSync.Code
{
    public class MouseHook
    {
        private Point point;
        private Point Point
        {
            get { return point; }
            set
            {
                if (point != value)
                {
                    point = value;
                    if (MouseMoveEvent != null)
                    {
                        var e = new System.Windows.Forms.MouseEventArgs(System.Windows.Forms.MouseButtons.None, 0, point.X, point.Y, 0);
                        MouseMoveEvent(this, e);
                    }
                }
            }
        }
        private int hHook;
        private const int WM_MOUSEMOVE = 0x200;
        private const int WM_LBUTTONDOWN = 0x201;
        private const int WM_RBUTTONDOWN = 0x204;
        private const int WM_MBUTTONDOWN = 0x207;
        private const int WM_LBUTTONUP = 0x202;
        private const int WM_RBUTTONUP = 0x205;
        private const int WM_MBUTTONUP = 0x208;
        private const int WM_LBUTTONDBLCLK = 0x203;
        private const int WM_RBUTTONDBLCLK = 0x206;
        private const int WM_MBUTTONDBLCLK = 0x209;

        public const int WH_MOUSE_LL = 14;
        public Win32Api.HookProc hProc;
        public MouseHook()
        {
            this.Point = new Point();
        }
        public int SetHook()
        {
            hProc = new Win32Api.HookProc(MouseHookProc);
            hHook = Win32Api.SetWindowsHookEx(WH_MOUSE_LL, hProc, IntPtr.Zero, 0);
            return hHook;
        }
        public void UnHook()
        {
            Win32Api.UnhookWindowsHookEx(hHook);
        }
        private int MouseHookProc(int nCode, IntPtr wParam, IntPtr lParam)
        {
            Win32Api.MouseHookStruct MyMouseHookStruct = (Win32Api.MouseHookStruct)System.Runtime.InteropServices.Marshal.PtrToStructure(lParam, typeof(Win32Api.MouseHookStruct));
            if (nCode < 0)
            {
                return Win32Api.CallNextHookEx(hHook, nCode, wParam, lParam);
            }
            else
            {
                System.Windows.Forms.MouseButtons button = System.Windows.Forms.MouseButtons.None;
                int clickCount = 0;
                switch ((Int32)wParam)
                {
                    case WM_LBUTTONDOWN:
                        button = System.Windows.Forms.MouseButtons.Left;
                        clickCount = 1;
                        MouseDownEvent(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_RBUTTONDOWN:
                        button = System.Windows.Forms.MouseButtons.Right;
                        clickCount = 1;
                        MouseDownEvent(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_MBUTTONDOWN:
                        button = System.Windows.Forms.MouseButtons.Middle;
                        clickCount = 1;
                        MouseDownEvent(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_LBUTTONUP:
                        button = System.Windows.Forms.MouseButtons.Left;
                        clickCount = 1;
                        MouseUpEvent(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_RBUTTONUP:
                        button = System.Windows.Forms.MouseButtons.Right;
                        clickCount = 1;
                        MouseUpEvent(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_MBUTTONUP:
                        button = System.Windows.Forms.MouseButtons.Middle;
                        clickCount = 1;
                        MouseUpEvent(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                }

                this.Point = new Point(MyMouseHookStruct.pt.X, MyMouseHookStruct.pt.Y);
                return Win32Api.CallNextHookEx(hHook, nCode, wParam, lParam);
            }
        }

        public delegate void MouseMoveHandler(object sender, System.Windows.Forms.MouseEventArgs e);
        public event MouseMoveHandler MouseMoveEvent;

        public delegate void MouseDownHandler(object sender, System.Windows.Forms.MouseEventArgs e);
        public event MouseDownHandler MouseDownEvent;

        public delegate void MouseUpHandler(object sender, System.Windows.Forms.MouseEventArgs e);
        public event MouseUpHandler MouseUpEvent;

        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        public static void DropMove()
        {
            Win32Api.Point curPos;
            IntPtr hWndPopup;

            Win32Api.GetCursorPos(out curPos);
            hWndPopup = Win32Api.WindowFromPoint(curPos);

            Win32Api.ReleaseCapture();
            Win32Api.SendMessage(hWndPopup, WM_NCLBUTTONDOWN, new IntPtr(HT_CAPTION), IntPtr.Zero);
        }
    }
}
