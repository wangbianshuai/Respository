using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MouseSync.Code
{
    public class KeyboardMouseHook
    {
        ~KeyboardMouseHook()
        {
            UnHook();
        }

        int _MounseHookId { get; set; }
        int _KeyboardHookId { get; set; }

        const int WH_KEYBOARD_LL = 13;   //线程键盘钩子监听鼠标消息设为2，全局键盘监听鼠标消息设为13
        const int WH_MOUSE_LL = 14; //全局钩子监听鼠标消息设为14

        Win32Api.HookProc _MouseProc;
        Win32Api.HookProc _KeyboardProc;

        public void SetHook()
        {
            try
            {
                if (IsMouseHook)
                {
                    _MouseProc = new Win32Api.HookProc(MouseHookProc);
                    _MounseHookId = Win32Api.SetWindowsHookEx(WH_MOUSE_LL, _MouseProc, IntPtr.Zero, 0);
                }

                if (IsKeyboardHook)
                {
                    _KeyboardProc = new Win32Api.HookProc(KeyboardHookProc);
                    _KeyboardHookId = Win32Api.SetWindowsHookEx(WH_KEYBOARD_LL, _KeyboardProc, IntPtr.Zero, 0);
                }
            }
            catch (Exception ex)
            {
                //Utils.Common.Alert("KeyboardMouseHook", "SetHook", ex);
            }
        }

        public void UnHook()
        {
            try
            {
                if (_MounseHookId > 0) Win32Api.UnhookWindowsHookEx(_MounseHookId);
                if (_KeyboardHookId > 0) Win32Api.UnhookWindowsHookEx(_KeyboardHookId);

                _MounseHookId = 0;
                _KeyboardHookId = 0;
            }
            catch (Exception ex)
            {
               // Utils.Common.Alert("KeyboardMouseHook", "UnHook", ex);
            }
        }

        const int WM_KEYDOWN = 0x100;//KEYDOWN
        const int WM_KEYUP = 0x101;//KEYUP
        const int WM_SYSKEYDOWN = 0x104;//SYSKEYDOWN
        const int WM_SYSKEYUP = 0x105;//SYSKEYUP

        public event KeyEventHandler KeyDown;
        public event KeyPressEventHandler KeyPress;
        public event KeyEventHandler KeyUp;

        public static bool IsKeyboardHook { get; set; }
        public static bool IsMouseHook { get; set; }

        int KeyboardHookProc(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (!IsKeyboardHook) return 0;

            int iParam = (Int32)wParam;
            // 侦听键盘事件
            if ((nCode >= 0) && (KeyDown != null || KeyUp != null || KeyPress != null))
            {
                Win32Api.KeyboardHookStruct MyKeyboardHookStruct = (Win32Api.KeyboardHookStruct)Marshal.PtrToStructure(lParam, typeof(Win32Api.KeyboardHookStruct));
                // raise KeyDown
                if (KeyDown != null && (iParam == WM_KEYDOWN || iParam == WM_SYSKEYDOWN))
                {
                    Keys keyData = (Keys)MyKeyboardHookStruct.vkCode;
                    KeyEventArgs e = new KeyEventArgs(keyData);
                    KeyDown(this, e);
                }

                //键盘按下
                if (KeyPress != null && iParam == WM_KEYDOWN)
                {
                    byte[] keyState = new byte[256];
                    Win32Api.GetKeyboardState(keyState);

                    byte[] inBuffer = new byte[2];
                    if (Win32Api.ToAscii(MyKeyboardHookStruct.vkCode, MyKeyboardHookStruct.scanCode, keyState, inBuffer, MyKeyboardHookStruct.flags) == 1)
                    {
                        KeyPressEventArgs e = new KeyPressEventArgs((char)inBuffer[0]);
                        KeyPress(this, e);
                    }
                }

                // 键盘抬起
                if (KeyUp != null && (iParam == WM_KEYUP || iParam == WM_SYSKEYUP))
                {
                    Keys keyData = (Keys)MyKeyboardHookStruct.vkCode;
                    KeyEventArgs e = new KeyEventArgs(keyData);
                    KeyUp(this, e);
                }

            }
            //如果返回1，则结束消息，这个消息到此为止，不再传递。
            //如果返回0或调用CallNextHookEx函数则消息出了这个钩子继续往下传递，也就是传给消息真正的接受者
            return Win32Api.CallNextHookEx(_KeyboardHookId, nCode, wParam, lParam);
        }

        const int WM_MOUSEMOVE = 0x200;
        const int WM_LBUTTONDOWN = 0x201;
        const int WM_RBUTTONDOWN = 0x204;
        const int WM_MBUTTONDOWN = 0x207;
        const int WM_LBUTTONUP = 0x202;
        const int WM_RBUTTONUP = 0x205;
        const int WM_MBUTTONUP = 0x208;
        const int WM_LBUTTONDBLCLK = 0x203;
        const int WM_RBUTTONDBLCLK = 0x206;
        const int WM_MBUTTONDBLCLK = 0x209;

        public event MouseEventHandler MouseMove;
        public event MouseEventHandler MouseDown;
        public event MouseEventHandler MouseUp;

        int MouseHookProc(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (!IsKeyboardHook) return 0;

            Win32Api.MouseHookStruct MyMouseHookStruct = (Win32Api.MouseHookStruct)System.Runtime.InteropServices.Marshal.PtrToStructure(lParam, typeof(Win32Api.MouseHookStruct));
            if (nCode < 0)
            {
                return Win32Api.CallNextHookEx(_MounseHookId, nCode, wParam, lParam);
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
                        MouseDown(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_RBUTTONDOWN:
                        button = System.Windows.Forms.MouseButtons.Right;
                        clickCount = 1;
                        MouseDown(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_MBUTTONDOWN:
                        button = System.Windows.Forms.MouseButtons.Middle;
                        clickCount = 1;
                        MouseDown(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_LBUTTONUP:
                        button = System.Windows.Forms.MouseButtons.Left;
                        clickCount = 1;
                        MouseUp(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_RBUTTONUP:
                        button = System.Windows.Forms.MouseButtons.Right;
                        clickCount = 1;
                        MouseUp(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                    case WM_MBUTTONUP:
                        button = System.Windows.Forms.MouseButtons.Middle;
                        clickCount = 1;
                        MouseUp(this, new System.Windows.Forms.MouseEventArgs(button, clickCount, point.X, point.Y, 0));
                        break;
                }

                this.Point = new Point(MyMouseHookStruct.pt.X, MyMouseHookStruct.pt.Y);
                return Win32Api.CallNextHookEx(_MounseHookId, nCode, wParam, lParam);
            }
        }

        Point point;
        Point Point
        {
            get { return point; }
            set
            {
                if (point != value)
                {
                    point = value;
                    if (MouseMove != null)
                    {
                        var e = new System.Windows.Forms.MouseEventArgs(System.Windows.Forms.MouseButtons.None, 0, point.X, point.Y, 0);
                        MouseMove(this, e);
                    }
                }
            }
        }
    }
}
