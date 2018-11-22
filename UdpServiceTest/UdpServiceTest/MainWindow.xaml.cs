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

namespace UdpServiceTest
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnSet_Click(object sender, RoutedEventArgs e)
        {

        }

        private void btnSend_Click(object sender, RoutedEventArgs e)
        {
            Distribution.Send(this.txtContent.Text, 123, Guid.Empty, null);
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            Distribution.SetDispatch = (a, b) =>
            {
                this.Dispatcher.Invoke(() =>
                {
                    this.txtRecord.Text += "\n";
                    this.txtRecord.Text += (string)a;
                });
            };
        }
    }
}
