using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
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
            //MessageBox.Show("测试点击1");

            ScrollViewer1.Focus();
            Code.MouseAction.Scroll(20);
        }

        Code.KeyboardMouse _KeyboardMouse { get; set; }

        void InitMouse()
        {
            Code.KeyboardMouseHook.IsMouseHook = true;
            _KeyboardMouse = new Code.KeyboardMouse();
            _KeyboardMouse.Width = System.Windows.SystemParameters.WorkArea.Width;
            _KeyboardMouse.Height = System.Windows.SystemParameters.WorkArea.Height;
            _KeyboardMouse.KeyboardMouseHook.SetHook();
        }
    }
}
