using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MouseSync
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            InitMouse();

          
          
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Task.Run(() =>
            {
                Thread.Sleep(1000);
                Dispatcher.Invoke(() =>
                {
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_MOVE, 80, 100, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTDOWN | Code.Win32Api.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                    //Code.MouseAction.Scroll(-1);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_WHEEL, 0, 0, -120, 0);

                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTDOWN | Code.Win32Api.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_WHEEL, 0, 0, -120, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTDOWN | Code.Win32Api.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_WHEEL, 0, 0, -120, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTDOWN | Code.Win32Api.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_WHEEL, 0, 0, -120, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTDOWN | Code.Win32Api.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_WHEEL, 0, 0, -120, 0);
                });
            });
            
        }

        Code.KeyboardMouse _KeyboardMouse { get; set; }

        void InitMouse()
        {
            //Code.KeyboardMouseHook.IsMouseHook = true;
            //_KeyboardMouse = new Code.KeyboardMouse();
            //_KeyboardMouse.Width = System.Windows.SystemParameters.WorkArea.Width;
            //_KeyboardMouse.Height = System.Windows.SystemParameters.WorkArea.Height;
            //_KeyboardMouse.KeyboardMouseHook.SetHook();
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            Task.Run(() =>
            {
                Thread.Sleep(1000);
                Dispatcher.Invoke(() =>
                {
                    //Button1.Focus();
                    Point p = Button1.PointToScreen(new Point(20, 20));

                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_MOVE, -80, 0, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTDOWN | Code.Win32Api.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
                });
            });

        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            //Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_WHEEL, 0, 0, -100, 0);

            ScrollViewer1.Focus();
          Code.Win32Api.SetScrollPos(((HwndSource)PresentationSource.FromVisual(ScrollViewer1)).Handle, 1, 200, 1);

        IntPtr hwnd=    ((HwndSource)PresentationSource.FromVisual(ScrollViewer1)).Handle;

        Code.Win32Api.SendMessage(hwnd, 0x115, 7, IntPtr.Zero);
          
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            Task.Run(() =>
            {
                Thread.Sleep(5000);
                Dispatcher.Invoke(() =>
                {
                    //Code.Win32Api.BlockInput(true);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_WHEEL, 0, 0, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);

                    for (int i = 1; i < 200; i++)
                    {
                        Thread.Sleep(10);
                      
                        i += 5;
                    }
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_MOVE, 0, 200, 0, 0);
                    Code.Win32Api.mouse_event(Code.Win32Api.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);

                    //Code.Win32Api.BlockInput(false);
          
                });
            });
        }
    }
}
