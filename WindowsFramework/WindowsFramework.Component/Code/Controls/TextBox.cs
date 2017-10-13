using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Component.Code.Components;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Controls
{
    public class TextBox : BaseControl, IControl
    {
        private System.Windows.Forms.TextBox _TextBox { get; set; }
        private PropertyItem _PropertyItem { get; set; }

        public TextBox(Dictionary<string, object> property, PropertyItem propertyItem)
        {
            _Property = property;
            _PropertyItem = propertyItem;
            _TextBox = new System.Windows.Forms.TextBox();
            this._Control = _TextBox;
            SetProperty();
            this.SetProperty(_PropertyItem._Form, _TextBox);
        }

        private void SetProperty()
        {
            this.SetDefaultValue("ControlMarginTop", 5);
            this.SetDefaultValue("ControlMarginLeft", 5);
            this.SetDefaultValue("IsEdit", true);
            this.SetDefaultValue("MaxLength", 50);
            this.SetDefaultValue("IsNullable", true);
        }

        protected override void SetProperty(string name, object value)
        {
            System.Windows.Forms.TextBox t = _TextBox;
            switch (name)
            {
                case "Name": t.Name = (string)value; break;
                case "ControlWidth": t.Width = (int)value; break;
                case "MaxLength": t.MaxLength = (int)value; break;
                case "ControlType": if (((string)value).Equals("Password")) t.UseSystemPasswordChar = true; break;
            }
        }

        /// <summary>
        /// 获取控件
        /// </summary>
        /// <returns></returns>
        public override System.Windows.Forms.Control GetControl()
        {
            return this._TextBox;
        }

        public override bool ValidateNullable(out string message)
        {
            message = string.Empty;
            bool isNullable = this._Property.GetValue<bool>("IsNullable");
            string label = this._Property.GetStringValue("Label");
            label = label ?? string.Empty;
            label = label.TrimEnd(new char[] { '：', ':' });
            if (!isNullable)
            {
                if (string.IsNullOrEmpty((string)this.GetValue()))
                {
                    message = string.Format("{0}，不能为空！", label);
                    this._TextBox.Focus();
                    return false;
                }
            }

            return true;
        }
    }
}
