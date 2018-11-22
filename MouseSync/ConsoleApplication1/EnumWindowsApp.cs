using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    public delegate bool CallBack(int hwnd, int lParam);
    public class EnumWindowsApp
    {
        [DllImport("user32")]
        public static extern int EnumWindows(CallBack x, int y);

        public static bool Report(int hwnd, int lParam)
        {
            Console.Write("Window handle is :");
            Console.WriteLine(hwnd);
            return true;
        }
    }
}
