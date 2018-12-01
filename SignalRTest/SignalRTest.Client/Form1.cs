using Microsoft.AspNet.SignalR.Client;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SignalRTest.Client
{
    public partial class Form1 : Form
    {
        Connection _Connection { get; set; }


         IHubProxy _Proxy { get; set; }

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            _Connection = new Connection("http://139.224.234.155:9000/connections/device");

            _Connection.Received += _Connection_Received;

            //_Proxy = _Connection.CreateHubProxy("HubService");
            //_Proxy.On("Recive", (s) => this.Receive(s));

         

            _Connection.Start();
        }

        private void _Connection_Received(string obj)
        {
            Receive(obj);
        }

        void Receive(string content)
        {
            this.Invoke(new Action(() =>
            {
                this.richTextBox1.Text += content + "\n";
            }));
        }

        private void button1_Click(object sender, EventArgs e)
        {
            _Connection.Send(this.richTextBox2.Text);


            //_Proxy.Invoke("Send", this.richTextBox2.Text);
        }
    }
}
