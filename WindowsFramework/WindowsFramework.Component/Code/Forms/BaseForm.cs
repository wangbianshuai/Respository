using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Component.Code.Components;
using WindowsFramework.Component.Code.Controls;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Forms
{
    public abstract class BaseForm : IForm
    {
        protected List<IComponent> _ComponentList { get; set; }
        protected System.Windows.Forms.Form _Form { get; set; }
        public System.Windows.Forms.Form ParentForm { get; set; }
        protected Dictionary<string, object> _View { get; set; }

        public System.Drawing.Point StartPoint { get; set; }
        public int TabIndex { get; set; }

        protected void SetForm()
        {
            StartPoint = new System.Drawing.Point(30, 20);
            TabIndex = 0;

            _ComponentList = new List<IComponent>();

            foreach (var kvp in this._View)
            {
                if (kvp.Key.Equals("Properties"))
                {
                    this.SetPropertyList(kvp.Value as List<Dictionary<string, object>>);
                }
                else
                {
                    this.SetFormProperty(kvp.Key, kvp.Value);
                }
            }
        }

        protected System.Windows.Forms.Form GetNewForm()
        {
            return (System.Windows.Forms.Form)Activator.CreateInstance(this._Form.GetType());
        }

        protected void SetPropertyList(List<Dictionary<string, object>> dictList)
        {
            string controlType = string.Empty;
            dictList.ForEach(p =>
            {
                controlType = p.GetStringValue("ControlType");

                SetProperty(controlType, p);
            });
        }

        protected void SetProperty(string controlType, Dictionary<string, object> dict)
        {
            switch (controlType)
            {
                case "GroupBox": this._ComponentList.Add(new GroupBoxComponent(dict, this)); break;
                default: this._ComponentList.Add(new PropertyItem(dict, this)); break;
            }
        }

        protected void SetFormProperty(string name, object value)
        {
            switch (name)
            {
                case "Text": _Form.Text = (string)value; break;
                case "Width": _Form.Width = (int)value; break;
                case "Height": _Form.Height = (int)value; break;
                case "MaximizeBox": _Form.MaximizeBox = (bool)value; break;
                case "FormBorderStyle": SetFormBorderStyle((string)value); break;
                case "StartPosition": SetFormStartPosition((string)value); break;
                case "WindowsState": SetFormWindowsState((string)value); break;
            }
        }

        private void SetFormWindowsState(string value)
        {
            switch (value)
            {
                case "Maximized": _Form.WindowState = System.Windows.Forms.FormWindowState.Maximized; break;
                case "Minimized": _Form.WindowState = System.Windows.Forms.FormWindowState.Minimized; break;
            }
        }

        private void SetFormStartPosition(string value)
        {
            switch (value)
            {
                case "CenterScreen": _Form.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen; break;
                case "CenterParent": _Form.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent; break;
            }
        }

        private void SetFormBorderStyle(string value)
        {
            switch (value)
            {
                case "FixedSingle": _Form.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle; break;
                case "None": _Form.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None; break;
            }
        }

        /// <summary>
        /// 获取控件列表
        /// </summary>
        /// <returns></returns>
        public virtual List<System.Windows.Forms.Control> GetControls()
        {
            List<System.Windows.Forms.Control> controlList = new List<System.Windows.Forms.Control>();

            if (this._ComponentList.Count > 0)
            {
                controlList.AddRange((from a in this._ComponentList
                                      from b in a.GetControls()
                                      select b));
            }

            List<System.Windows.Forms.Control> controlList2 = new List<System.Windows.Forms.Control>();

            controlList2.AddRange(from a in controlList
                                  where a.Dock == System.Windows.Forms.DockStyle.Fill
                                  select a);

            controlList2.AddRange(from a in controlList
                                  where a.Dock != System.Windows.Forms.DockStyle.Fill
                                  select a);
            return controlList2;
        }

        /// <summary>
        /// 事件加载
        /// </summary>
        public virtual void EventLoad()
        {
            if (this._ComponentList.Count > 0) this._ComponentList.ForEach(c => c.EventLoad());
        }

        /// <summary>
        /// 数据加载
        /// </summary>
        public virtual void DataLoad()
        {
            if (this._ComponentList.Count > 0) this._ComponentList.ForEach(c => c.DataLoad());
        }

        /// <summary>
        /// 事件调用
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <param name="control"></param>
        public virtual void EventInvoke(object sender, EventArgs e, Controls.IControl control)
        {
        }

        public Dictionary<string, object> GetEditData(out string message)
        {
            message = string.Empty;
            Dictionary<string, object> dict = new Dictionary<string, object>();

            foreach (IComponent c in this._ComponentList)
            {
                if (c.IsEdit())
                {
                    if (!c.ValidateNullable(out message)) break;
                    dict.Add(c.GetName(), c.GetValue());
                }
            }

            return dict;
        }
    }
}
