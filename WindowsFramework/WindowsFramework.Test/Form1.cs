using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Windows.Forms;

namespace WindowsFramework.Test
{
    public partial class Form1 : Form
    {
        Microsoft.Office.Interop.Word.Document doc { get; set; }
        UdpService udp { get; set; }

        public Form1()
        {
            InitializeComponent();
            //System.Windows.Forms.Control.CheckForIllegalCrossThreadCalls = false; 
            try
            {
                this.RegControl();

                //this.axFramerControl2.Open(Application.StartupPath + "\\test2.docx");

                 //doc = (Microsoft.Office.Interop.Word.Document)axFramerControl2.ActiveDocument;

                //显示小翻页，即只翻一个屏幕的内容  
                doc.Windows.Application.ActiveWindow.VerticalPercentScrolled = 10;

                Action<string> receive = (content) =>
                {
                    if (content != this.label1.Text)
                    {
                        doc.Windows.Application.ActiveWindow.VerticalPercentScrolled = int.Parse(content);
                    }
                };
                udp = new UdpService(7780, receive);
                udp.Load();


                Timer timer = new Timer();
                timer.Tick += timer_Tick;
                timer.Interval = 10;
                timer.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.InnerException.Message);
            }

        }

        void timer_Tick(object sender, EventArgs e)
        {
            string vs = doc.Windows.Application.ActiveWindow.VerticalPercentScrolled.ToString();
            if (this.label1.Text != vs)
            {
                this.label1.Text = vs;
                this.udp.Send(this.label1.Text);
            }
        }

        private void LoadDLL()
        {
            try
            {
                string path = Application.StartupPath + "\\WindowsFramework.Component.dll";

                //FileStream fs = new FileStream(path, FileMode.Create);
                //byte[] bytes = GetFileStream2();

                //BinaryWriter bw = new BinaryWriter(fs);
                //bw.Write(bytes);
                //bw.Flush();
                //bw.Close();
                //fs.Close();

                Utility.Common.DeCompress(Utility.Common.GetHttpFileBytes("http://localhost/wfapi/res/name1"), Application.StartupPath);

                System.Reflection.Assembly assembly = System.Reflection.Assembly.LoadFrom(path);

                Type type = assembly.GetType("WindowsFramework.Component.Login");
                Activator.CreateInstance(type, this);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "提示信息");
            }
        }

        public MemoryStream GetFileStream(string path)
        {
            HttpWebRequest webRequest = (HttpWebRequest)HttpWebRequest.Create(path);
            using (var webResponse = webRequest.GetResponse())
            {
                Stream stream = webResponse.GetResponseStream();

                MemoryStream memoryStream = new MemoryStream();
                const int bufferLength = 1024;
                int actual;
                byte[] buffer = new byte[bufferLength];
                while ((actual = stream.Read(buffer, 0, bufferLength)) > 0)
                {
                    memoryStream.Write(buffer, 0, actual);
                }
                memoryStream.Position = 0;

                return memoryStream;
            }
        }

        public byte[] GetFileStream2()
        {
            HttpClient client = new HttpClient();
            return client.GetByteArrayAsync("http://localhost/wfapi/res/name1").Result;
        }

        public MemoryStream GetFileStream()
        {
            HttpClient client = new HttpClient();
            using (Stream stream = client.GetStreamAsync("http://localhost/wfapi/res/name1").Result)
            {
                MemoryStream memoryStream = new MemoryStream();
                const int bufferLength = 1024;
                int actual;
                byte[] buffer = new byte[bufferLength];
                while ((actual = stream.Read(buffer, 0, bufferLength)) > 0)
                {
                    memoryStream.Write(buffer, 0, actual);
                }
                memoryStream.Position = 0;

                return memoryStream;
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            MessageBox.Show(doc.Windows.Application.ActiveWindow.VerticalPercentScrolled.ToString());

           
        }


        public bool RegControl()
        {
            try
            {
                Assembly thisExe = Assembly.GetExecutingAssembly();
                System.IO.Stream myS = thisExe.GetManifestResourceStream("NameSpaceName.dsoframer.ocx");

                string sPath = Application.StartupPath + "\\dsoframer.ocx";
                ProcessStartInfo psi = new ProcessStartInfo("regsvr32", "/s " + sPath);
                Process.Start(psi);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            return true;
        }
    }
}
