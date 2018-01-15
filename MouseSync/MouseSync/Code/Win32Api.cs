using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MouseSync.Code
{
    public class Win32Api
    {
        [DllImport("user32.dll")]
        public static extern IntPtr WindowFromPoint(Point point);

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool GetCursorPos(out Point lpPoint);

        [DllImportAttribute("user32.dll")]
        public static extern IntPtr SendMessage(IntPtr hWnd, int Msg, IntPtr wParam, IntPtr lParam);

        [DllImportAttribute("user32.dll")]
        public static extern bool ReleaseCapture();

        [StructLayout(LayoutKind.Sequential)]
        public struct Point { public int X; public int Y;};

        [StructLayout(LayoutKind.Sequential)]
        public class MouseHookStruct
        {
            public Point pt;
            public int hwnd;
            public int wHitTestCode;
            public int dwExtraInfo;
        }

        //键盘结构
        [StructLayout(LayoutKind.Sequential)]
        public class KeyboardHookStruct
        {
            public int vkCode;  //定一个虚拟键码。该代码必须有一个价值的范围1至254
            public int scanCode; // 指定的硬件扫描码的关键
            public int flags;  // 键标志
            public int time; // 指定的时间戳记的这个讯息
            public int dwExtraInfo; // 指定额外信息相关的信息
        }

        public delegate int HookProc(int nCode, IntPtr wParam, IntPtr lParam);
        //安装钩子
        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern int SetWindowsHookEx(int idHook, HookProc lpfn, IntPtr hInstance, int threadId);
        //卸载钩子
        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern bool UnhookWindowsHookEx(int idHook);
        //调用下一个钩子
        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern int CallNextHookEx(int idHook, int nCode, IntPtr wParam, IntPtr lParam);

        public const int MOUSEEVENTF_LEFTDOWN = 0x0002;//模拟鼠标左键按下
        public const int MOUSEEVENTF_MOVE = 0x0001;//模拟鼠标移动
        public const int MOUSEEVENTF_LEFTUP = 0x0004;//模拟鼠标左键抬起
        public const int MOUSEEVENTF_ABSOLUTE = 0x8000;//鼠标绝对位置
        public const int MOUSEEVENTF_RIGHTDOWN = 0x0008; //模拟鼠标右键按下 
        public const int MOUSEEVENTF_RIGHTUP = 0x0010; //模拟鼠标右键抬起 
        public const int MOUSEEVENTF_MIDDLEDOWN = 0x0020; //模拟鼠标中键按下 
        public const int MOUSEEVENTF_MIDDLEUP = 0x0040;// 模拟鼠标中键抬起 

        [DllImport("user32")]
        public static extern void mouse_event(int dwFlags, int dx, int dy, int dwData, int dwExtraInfo);

        public static void Mouse_Up(int x, int y)
        {
            mouse_event(MOUSEEVENTF_LEFTUP, x, y, 0, 0);
        }

        //ToAscii职能的转换指定的虚拟键码和键盘状态的相应字符或字符
        [DllImport("user32")]
        public static extern int ToAscii(int uVirtKey, //[in] 指定虚拟关键代码进行翻译。
                                         int uScanCode, // [in] 指定的硬件扫描码的关键须翻译成英文。高阶位的这个值设定的关键，如果是（不压）
                                         byte[] lpbKeyState, // [in] 指针，以256字节数组，包含当前键盘的状态。每个元素（字节）的数组包含状态的一个关键。如果高阶位的字节是一套，关键是下跌（按下）。在低比特，如果设置表明，关键是对切换。在此功能，只有肘位的CAPS LOCK键是相关的。在切换状态的NUM个锁和滚动锁定键被忽略。
                                         byte[] lpwTransKey, // [out] 指针的缓冲区收到翻译字符或字符。
                                         int fuState); // [in] Specifies whether a menu is active. This parameter must be 1 if a menu is active, or 0 otherwise.

        //获取按键的状态
        [DllImport("user32")]
        public static extern int GetKeyboardState(byte[] pbKeyState);


        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        private static extern short GetKeyState(int vKey);

        // Two special bitmasks we define to be able to grab
        // shift and character information out of a VKey.
        internal const int VKeyShiftMask = 0x0100;
        internal const int VKeyCharMask = 0x00FF;

        // Various Win32 constants
        internal const int KeyeventfExtendedkey = 0x0001;
        internal const int KeyeventfKeyup = 0x0002;
        internal const int KeyeventfScancode = 0x0008;

        internal const int MouseeventfVirtualdesk = 0x4000;

        internal const int SMXvirtualscreen = 76;
        internal const int SMYvirtualscreen = 77;
        internal const int SMCxvirtualscreen = 78;
        internal const int SMCyvirtualscreen = 79;

        internal const int XButton1 = 0x0001;
        internal const int XButton2 = 0x0002;
        internal const int WheelDelta = 120;

        internal const int InputMouse = 0;
        internal const int InputKeyboard = 1;

        // Various Win32 data structures
        [StructLayout(LayoutKind.Sequential)]
        internal struct INPUT
        {
            internal int type;
            internal INPUTUNION union;
        };

        [StructLayout(LayoutKind.Explicit)]
        internal struct INPUTUNION
        {
            [FieldOffset(0)]
            internal MOUSEINPUT mouseInput;
            [FieldOffset(0)]
            internal KEYBDINPUT keyboardInput;
        };

        [StructLayout(LayoutKind.Sequential)]
        internal struct MOUSEINPUT
        {
            internal int dx;
            internal int dy;
            internal int mouseData;
            internal int dwFlags;
            internal int time;
            internal IntPtr dwExtraInfo;
        };

        [StructLayout(LayoutKind.Sequential)]
        internal struct KEYBDINPUT
        {
            internal short wVk;
            internal short wScan;
            internal int dwFlags;
            internal int time;
            internal IntPtr dwExtraInfo;
        };

        [Flags]
        internal enum SendMouseInputFlags
        {
            Move = 0x0001,
            LeftDown = 0x0002,
            LeftUp = 0x0004,
            RightDown = 0x0008,
            RightUp = 0x0010,
            MiddleDown = 0x0020,
            MiddleUp = 0x0040,
            XDown = 0x0080,
            XUp = 0x0100,
            Wheel = 0x0800,
            Absolute = 0x8000,
        };

        // Importing various Win32 APIs that we need for input
        [DllImport("user32.dll", ExactSpelling = true, CharSet = CharSet.Auto)]
        internal static extern int GetSystemMetrics(int nIndex);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        internal static extern int MapVirtualKey(int nVirtKey, int nMapType);

        [DllImport("user32.dll", SetLastError = true)]
        internal static extern int SendInput(int nInputs, ref INPUT mi, int cbSize);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        internal static extern short VkKeyScan(char ch);
    }
}
