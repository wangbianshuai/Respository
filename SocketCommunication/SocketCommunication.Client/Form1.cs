using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SocketCommunication.Client
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        SocketCore.SocketClient _SocketClient { get; set; }

        private void Form1_Load(object sender, EventArgs e)
        {
            SocketCore.SocketClient.AlertAction = (s) => MessageBox.Show(s);
            Task.Run(() => _SocketClient = new SocketCore.SocketClient((s) => Receive(s)));
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
            _SocketClient.Send(this.textBox1.Text);
        }
    }
}
