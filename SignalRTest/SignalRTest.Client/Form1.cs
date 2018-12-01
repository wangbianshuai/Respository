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
        HubConnection _HubConnection { get; set; }


         IHubProxy _Proxy { get; set; }

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            _Connection = new Connection("http://localhost:54137/service");

            _Connection.Received += _Connection_Received;

            _Connection.Start();

            _HubConnection = new HubConnection("http://localhost:54137/");
            _Proxy = _HubConnection.CreateHubProxy("HubService");
            _Proxy.On<string, string>("Receive", (content, senderId) => this.Receive(content, senderId));

            _HubConnection.Start();
        }

        private void _Connection_Received(string obj)
        {
            Receive(obj, string.Empty);
        }

        void Receive(string content, string senderId)
        {
            this.Invoke(new Action(() =>
            {
                this.richTextBox1.Text += content + "\n";
            }));
        }

        private void button1_Click(object sender, EventArgs e)
        {
            _Proxy.Invoke("Send", this.richTextBox2.Text, null);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            _Connection.Send(this.richTextBox2.Text);
        }
    }
}
