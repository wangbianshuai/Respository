using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace MouseSync.Code
{
    public static class MouseAction
    {
        public static void Click(MouseButton mouseButton)
        {
            Down(mouseButton);
            Up(mouseButton);
        }

        public static void DoubleClick(MouseButton mouseButton)
        {
            Click(mouseButton);
            Click(mouseButton);
        }

        public static void Down(MouseButton mouseButton)
        {
            switch (mouseButton)
            {
                case MouseButton.Left:
                    SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.LeftDown);
                    break;
                case MouseButton.Right:
                    SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.RightDown);
                    break;
                case MouseButton.Middle:
                    SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.MiddleDown);
                    break;
                case MouseButton.XButton1:
                    SendMouseInput(0, 0, Win32Api.XButton1, Win32Api.SendMouseInputFlags.XDown);
                    break;
                case MouseButton.XButton2:
                    SendMouseInput(0, 0, Win32Api.XButton2, Win32Api.SendMouseInputFlags.XDown);
                    break;
                default:
                    throw new InvalidOperationException("Unsupported MouseButton input.");
            }
        }

        public static void MoveTo(System.Drawing.Point point)
        {
            SendMouseInput(point.X, point.Y, 0, Win32Api.SendMouseInputFlags.Move | Win32Api.SendMouseInputFlags.Absolute);
        }

        public static void Reset()
        {
            MoveTo(new System.Drawing.Point(0, 0));

            if (System.Windows.Input.Mouse.LeftButton == MouseButtonState.Pressed)
            {
                SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.LeftUp);
            }

            if (System.Windows.Input.Mouse.MiddleButton == MouseButtonState.Pressed)
            {
                SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.MiddleUp);
            }

            if (System.Windows.Input.Mouse.RightButton == MouseButtonState.Pressed)
            {
                SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.RightUp);
            }

            if (System.Windows.Input.Mouse.XButton1 == MouseButtonState.Pressed)
            {
                SendMouseInput(0, 0, Win32Api.XButton1, Win32Api.SendMouseInputFlags.XUp);
            }

            if (System.Windows.Input.Mouse.XButton2 == MouseButtonState.Pressed)
            {
                SendMouseInput(0, 0, Win32Api.XButton2, Win32Api.SendMouseInputFlags.XUp);
            }
        }

        public static void Scroll(double lines)
        {
            int amount = (int)(Win32Api.WheelDelta * lines);

            SendMouseInput(0, 0, amount, Win32Api.SendMouseInputFlags.Wheel);
        }

        public static void Up(MouseButton mouseButton)
        {
            switch (mouseButton)
            {
                case MouseButton.Left:
                    SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.LeftUp);
                    break;
                case MouseButton.Right:
                    SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.RightUp);
                    break;
                case MouseButton.Middle:
                    SendMouseInput(0, 0, 0, Win32Api.SendMouseInputFlags.MiddleUp);
                    break;
                case MouseButton.XButton1:
                    SendMouseInput(0, 0, Win32Api.XButton1, Win32Api.SendMouseInputFlags.XUp);
                    break;
                case MouseButton.XButton2:
                    SendMouseInput(0, 0, Win32Api.XButton2, Win32Api.SendMouseInputFlags.XUp);
                    break;
                default:
                    throw new InvalidOperationException("Unsupported MouseButton input.");
            }
        }

        [PermissionSet(SecurityAction.Assert, Name = "FullTrust")]
        private static void SendMouseInput(int x, int y, int data, Win32Api.SendMouseInputFlags flags)
        {
            try
            {
                PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
                permissions.Demand();

                int intflags = (int)flags;

                if ((intflags & (int)Win32Api.SendMouseInputFlags.Absolute) != 0)
                {
                    NormalizeCoordinates(ref x, ref y);
                    intflags |= Win32Api.MouseeventfVirtualdesk;
                }

                Win32Api.INPUT mi = new Win32Api.INPUT();
                mi.type = Win32Api.InputMouse;
                mi.union.mouseInput.dx = x;
                mi.union.mouseInput.dy = y;
                mi.union.mouseInput.mouseData = data;
                mi.union.mouseInput.dwFlags = intflags;
                mi.union.mouseInput.time = 0;
                mi.union.mouseInput.dwExtraInfo = new IntPtr(0);

                if (Win32Api.SendInput(1, ref mi, Marshal.SizeOf(mi)) == 0)
                {
                    throw new Win32Exception(Marshal.GetLastWin32Error());
                }
            }
            catch (Exception ex)
            {
                //LoggerProxy.Exception("MouseAction", "SendMouseInput", ex);
            }
        }

        private static void NormalizeCoordinates(ref int x, ref int y)
        {
            int vScreenWidth = Win32Api.GetSystemMetrics(Win32Api.SMCxvirtualscreen);
            int vScreenHeight = Win32Api.GetSystemMetrics(Win32Api.SMCyvirtualscreen);
            int vScreenLeft = Win32Api.GetSystemMetrics(Win32Api.SMXvirtualscreen);
            int vScreenTop = Win32Api.GetSystemMetrics(Win32Api.SMYvirtualscreen);

            x = ((x - vScreenLeft) * 65536) / vScreenWidth + 65536 / (vScreenWidth * 2);
            y = ((y - vScreenTop) * 65536) / vScreenHeight + 65536 / (vScreenHeight * 2);
        }
    }
}
