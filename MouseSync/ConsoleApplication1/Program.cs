using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            CallBack myCallBack = new CallBack(EnumWindowsApp.Report);
            EnumWindowsApp.EnumWindows(myCallBack, 0);
            Console.ReadLine();
        }
    }
}
