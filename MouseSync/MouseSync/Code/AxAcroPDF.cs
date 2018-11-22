using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MouseSync.Code
{
    public class AxAcroPDF
    {
        public AxAcroPDFLib.AxAcroPDF AcroPDF { get; set; }

        public Dictionary<string, object> _Options { get; set; }

        public AxAcroPDF(Dictionary<string, object> options)
        {
            _Options = options;
        }

        public void OpenFile(string fileName)
        {
            AcroPDF.src = fileName;
        }

        public void InitAxFramerControl(System.Windows.Forms.Integration.WindowsFormsHost windowsFormsHost)
        {
            AcroPDF = new AxAcroPDFLib.AxAcroPDF();
            ((System.ComponentModel.ISupportInitialize)(AcroPDF)).BeginInit();

            AcroPDF.Enabled = true;
            AcroPDF.Name = _Options.GetStringValue("Name");
            AcroPDF.Dock = System.Windows.Forms.DockStyle.Fill;

            windowsFormsHost.Child = AcroPDF;

            ((System.ComponentModel.ISupportInitialize)(AcroPDF)).EndInit();
        }
    }
}
