using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Component.Code.Components;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Controls
{
    public class Button : BaseControl, IControl
    {
        private System.Windows.Forms.Button _Button { get; set; }
        private PropertyItem _PropertyItem { get; set; }

        public Button(Dictionary<string, object> property, PropertyItem propertyItem)
        {
            _Property = property;
            _PropertyItem = propertyItem;
            _Button = new System.Windows.Forms.Button();
            this._Control = _Button;
            SetProperty();
            SetProperty(_PropertyItem._Form, _Button);
        }

        private void SetProperty()
        {
            this.SetDefaultValue("IsClick", true);
        }

        protected override void SetProperty(string name, object value)
        {
            System.Windows.Forms.Button c = _Button;
            switch (name)
            {
                case "Text": c.Text = (string)value; break;
                case "ControlWidth": c.Width = (int)value; break;
            }
        }

        /// <summary>
        /// 获取控件
        /// </summary>
        /// <returns></returns>
        public override System.Windows.Forms.Control GetControl()
        {
            return this._Button;
        }


        /// <summary>
        /// 事件加载
        /// </summary>
        public override void EventLoad()
        {
            bool isClick = this._Property.GetValue<bool>("IsClick");
            if (isClick) this._Button.Click += _Button_Click;
        }

        void _Button_Click(object sender, EventArgs e)
        {
            this._PropertyItem._Form.EventInvoke(sender, e, this);
        }
    }
}
