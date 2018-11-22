using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
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

namespace DataDistribution.Client
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            this.txtDataKey.Text = "DataKey1234";
            this.txtUserId.Text = new Random().Next(10000, 99999).ToString();
        }

        private void btnSend_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                string userIdList = this.txtUserIdList.Text;
                string dataKey = this.txtDataKey.Text;
                
                string url = string.Format("{0}{1}/SetData?IdList={2}", "http://localhost/ds/api/", dataKey, System.Web.HttpUtility.UrlEncode(userIdList));

                byte[] bs = System.Text.Encoding.UTF8.GetBytes(this.txtContent.Text);

                HttpClient client = new HttpClient();
                Task<HttpResponseMessage> response = client.PostAsync(url, new StreamContent(new MemoryStream(bs)));
                if (response.Result.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    throw new Exception(response.Result.Content.ReadAsStringAsync().Result);
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        bool _IsReceive { get; set; }
        private void btnSet_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                _IsReceive = false;
                string dataKey = this.txtDataKey.Text;
                long userId = long.Parse(this.txtUserId.Text);
                if (string.IsNullOrEmpty(dataKey)) return;

                Task.Run(() => { _IsReceive = true; StartReceive(dataKey, userId); });
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        void StartReceive(string dataKey, long userId)
        {
            try
            {
                while (_IsReceive)
                {
                    Thread.Sleep(200);

                    GetData(dataKey, userId); 
                }
            }
            catch (Exception ex)
            {
                _IsReceive = false;
                Console.WriteLine(ex.Message);
            }
        }

        void GetData(string dataKey, long userId)
        {
            string url = string.Format("{0}{1}/{2}", "http://localhost/ds/api/", dataKey, userId);

            Stopwatch stopwatch = Stopwatch.StartNew();
            HttpClient client = new HttpClient();
            Task<HttpResponseMessage> response = client.GetAsync(url);
            if (response.Result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var stream = response.Result.Content.ReadAsStreamAsync().Result;
                if (stream != null && stream.Length > 0 && stream is MemoryStream)
                {
                    MemoryStream ms = stream as MemoryStream;
                    this.Dispatcher.Invoke(() => { this.txtRecord.Text = System.Text.Encoding.UTF8.GetString(ms.ToArray()); });

                    stopwatch.Stop();

                    Console.WriteLine(stopwatch.ElapsedMilliseconds);
                }
            }
         
        }
    }
}
