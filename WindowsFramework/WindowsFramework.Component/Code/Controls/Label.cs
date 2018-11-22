using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Utility;
using WindowsFramework.Component.Code.Components;

namespace WindowsFramework.Component.Code.Controls
{
    public class Label : BaseControl, IControl
    {
        private System.Windows.Forms.Label _Label { get; set; }
        private PropertyItem _PropertyItem { get; set; }

        public Label(Dictionary<string, object> property, PropertyItem propertyItem)
        {
            _Property = property;
            _PropertyItem = propertyItem;
            _Label = new System.Windows.Forms.Label();
            this._Control = _Label;
            SetProperty();
            SetProperty(_PropertyItem._Form, _Label, true);
        }

        private void SetProperty()
        {
            this.SetDefaultValue("TextAlign", "Right");
            this.SetDefaultValue("LabelMarginTop", 4);
        }

        protected override void SetProperty(string name, object value)
        {
            System.Windows.Forms.Label c = _Label;
            switch (name)
            {
                case "Label": c.Text = (string)value; break;
                case "LabelWidth": c.Width = (int)value; break;
                case "TextAlign": SetTextAlign(c, (string)value); break;
            }
        }

        private void SetTextAlign(System.Windows.Forms.Label c, string value)
        {
            switch (value)
            {
                case "Right": c.TextAlign = System.Drawing.ContentAlignment.MiddleRight; break;
                case "Center": c.TextAlign = System.Drawing.ContentAlignment.MiddleCenter; break;
                case "Left": c.TextAlign = System.Drawing.ContentAlignment.MiddleLeft; break;
            }
        }

        /// <summary>
        /// 获取控件
        /// </summary>
        /// <returns></returns>
        public override System.Windows.Forms.Control GetControl()
        {
            return this._Label;
        }
    }
}
