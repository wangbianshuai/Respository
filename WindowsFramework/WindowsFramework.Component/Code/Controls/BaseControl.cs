using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Utility;
using WindowsFramework.Component.Code.Forms;

namespace WindowsFramework.Component.Code.Controls
{
    public class BaseControl : IControl
    {
        public Dictionary<string, object> _Property { get; protected set; }

        public Dictionary<string, object> GetProperty() { return _Property; } 

        protected System.Windows.Forms.Control _Control { get; set; }

        /// <summary>
        /// 获取控件
        /// </summary>
        /// <returns></returns>
        public virtual System.Windows.Forms.Control GetControl()
        {
            return null;
        }

        /// <summary>
        /// 事件加载
        /// </summary>
        public virtual void EventLoad()
        {
        }

        /// <summary>
        /// 数据加载
        /// </summary>
        public virtual void DataLoad()
        {
        }

        /// <summary>
        /// 设置位置
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        public void SetLocation(int x, int y)
        {
            _Control.Location = new System.Drawing.Point(x, y);
        }

        protected void SetDefaultValue(string name, object value)
        {
            if (!this._Property.ContainsKey(name)) this._Property[name] = value;
        }

        protected void SetLabelLocation(System.Drawing.Point startPoint)
        {
            int x = _Property.GetValue<int>("X");
            int y = _Property.GetValue<int>("Y");
            int width = _Property.GetValue<int>("Width");
            int height = _Property.GetValue<int>("Height");
            int marginTop = _Property.GetValue<int>("LabelMarginTop");

            int x2 = (y - 1) * width + startPoint.X;
            int y2 = (x - 1) * height + marginTop + startPoint.Y;

            this.SetLocation(x2, y2);
        }

        protected void SetControlLocation(System.Drawing.Point startPoint)
        {
            int x = _Property.GetValue<int>("X");
            int y = _Property.GetValue<int>("Y");
            int width = _Property.GetValue<int>("Width");
            int height = _Property.GetValue<int>("Height");
            int marginTop = _Property.GetValue<int>("ControlMarginTop");
            int marginLeft = _Property.GetValue<int>("ControlMarginLeft");
            int labelWidth = _Property.GetValue<int>("LabelWidth");

            int x2 = (y - 1) * width + marginLeft + labelWidth + startPoint.X;
            int y2 = (x - 1) * height + marginTop + startPoint.Y;

            this.SetLocation(x2, y2);
        }

        protected void SetProperty(IForm form, System.Windows.Forms.Control control, bool blLabel = false)
        {
            bool isPoint = _Property.GetValue<bool>("IsPoint");
            if (isPoint)
            {
                int x = _Property.GetValue<int>("X");
                int y = _Property.GetValue<int>("Y");
                this.SetLocation(x, y);
            }
            else if (blLabel) this.SetLabelLocation(form.StartPoint);
            else this.SetControlLocation(form.StartPoint);

            control.TabIndex = form.TabIndex;
            form.TabIndex += 1;

            foreach (var kvp in _Property)
            {
                this.SetProperty(kvp.Key, kvp.Value);
            }
        }

        protected virtual void SetProperty(string name, object value)
        {

        }

        public virtual object GetValue()
        {
            return this._Control.Text;
        }

        public virtual void SetValue(object value)
        {
            if (value is string) this._Control.Text = (string)value;
        }

        public virtual bool ValidateNullable(out string message)
        {
            message = string.Empty;
            return true;
        }
    }
}
