using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;

namespace MouseSync.Code
{
    public class AxFramerControl
    {
        const string CLSID = "00460182-9E5E-11D5-B7C8-B8269041DD57";
        const string HideMenuBarAndTitleBar = "AAEAAAD/////AQAAAAAAAAAMAgAAAFdTeXN0ZW0uV2luZG93cy5Gb3JtcywgVmVyc2lvbj00LjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPWI3N2E1YzU2MTkzNGUwODkFAQAAACFTeXN0ZW0uV2luZG93cy5Gb3Jtcy5BeEhvc3QrU3RhdGUBAAAABERhdGEHAgIAAAAJAwAAAA8DAAAAPQAAAAIBAAAAAQAAAAAAAAAAAAAAACgAAADNqzQST00AAHsnAAAQAACABQAAgAgAAIANAACADgAAgAEAAQAAAAAACw==";
        const string HideMenuTitleTool = "AAEAAAD/////AQAAAAAAAAAMAgAAAFdTeXN0ZW0uV2luZG93cy5Gb3JtcywgVmVyc2lvbj00LjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPWI3N2E1YzU2MTkzNGUwODkFAQAAACFTeXN0ZW0uV2luZG93cy5Gb3Jtcy5BeEhvc3QrU3RhdGUBAAAABERhdGEHAgIAAAAJAwAAAA8DAAAAPQAAAAIBAAAAAQAAAAAAAAAAAAAAACgAAADNqzQST00AAHsnAAAQAACABQAAgAgAAIANAACADgAAgAEAAAAAAAAACw==";

        public AxDSOFramer.AxFramerControl FramerControl { get; set; }

        public Dictionary<string, object> _Options { get; set; }

        public AxFramerControl(Dictionary<string, object> options)
        {
            _Options = options;
            if (!_Options.ContainsKey("RegDirectory")) _Options["RegDirectory"] = AppDomain.CurrentDomain.BaseDirectory + "component";

            if (!IsRegistered()) RegControl();
        }

        public void OpenFile(string fileName)
        {
            FramerControl.Open(fileName);
        }

        public void InitAxFramerControl(System.Windows.Forms.Integration.WindowsFormsHost windowsFormsHost)
        {
            FramerControl = new AxDSOFramer.AxFramerControl();
            ((System.ComponentModel.ISupportInitialize)(FramerControl)).BeginInit();

            FramerControl.Enabled = true;
            FramerControl.Name = _Options.GetStringValue("Name");
            FramerControl.Dock = System.Windows.Forms.DockStyle.Fill;
            FramerControl.OcxState = GetAxHostState();

            windowsFormsHost.Child = FramerControl;

            ((System.ComponentModel.ISupportInitialize)(FramerControl)).EndInit();
        }

        private System.Windows.Forms.AxHost.State GetAxHostState()
        {
            string strState = HideMenuBarAndTitleBar;
            if (_Options.GetStringValue("HideBar") == "MenuTitleTool") strState = HideMenuTitleTool;

            byte[] bs = Convert.FromBase64String(strState);

            MemoryStream ms = new System.IO.MemoryStream(bs);
            BinaryFormatter bf = new BinaryFormatter();

            return (System.Windows.Forms.AxHost.State)bf.Deserialize(ms);
        }

        private bool IsRegistered()
        {
            if (string.IsNullOrEmpty(CLSID)) return false;

            string key = string.Format(@"CLSID\{{{0}}}", CLSID);
            RegistryKey regKey = Registry.ClassesRoot.OpenSubKey(key);
            if (regKey != null) return true;
            else return false;
        }

        public void RegControl()
        {
            try
            {
                string fileName = _Options.GetStringValue("RegDirectory") + "\\dsoframer.ocx";
                string path = Environment.Is64BitOperatingSystem ? "c:\\Windows\\SysWOW64\\dsoframer.ocx" : "c:\\windows\\system32\\dsoframer.ocx";
                FileInfo myfile = new FileInfo(fileName);
                myfile.CopyTo(path, true);

                fileName = _Options.GetStringValue("RegDirectory") + "\\pdfview.ocx";
                path = Environment.Is64BitOperatingSystem ? "c:\\Windows\\SysWOW64\\pdfview.ocx" : "c:\\windows\\system32\\pdfview.ocx";
                myfile = new FileInfo(fileName);
                myfile.CopyTo(path, true);

                string reg = Environment.Is64BitOperatingSystem ? "reg64.bat" : "reg32.bat";

                Process proc = new Process();
                proc.StartInfo.WorkingDirectory = _Options.GetStringValue("RegDirectory");
                proc.StartInfo.FileName = reg;
                proc.StartInfo.CreateNoWindow = false;
                proc.StartInfo.Verb = "runas";
                proc.Start();
                proc.WaitForExit();
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("AxFramerControl", "RegControl", ex);
            }
        }
    }
}
