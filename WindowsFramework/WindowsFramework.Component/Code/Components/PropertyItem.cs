using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Utility;
using WindowsFramework.Component.Code.Controls;
using WindowsFramework.Component.Code.Forms;

namespace WindowsFramework.Component.Code.Components
{
    public class PropertyItem : BaseComponent, IComponent
    {
        private Label _Label { get; set; }
        private TextBox _TextBox { get; set; }
        private Button _Button { get; set; }

        public PropertyItem(Dictionary<string, object> property, IForm form)
        {
            _Property = property;
            _Form = form;

            this._ControlList = new List<Controls.IControl>();

            string controlType = _Property.GetStringValue("ControlType");

            this.SetDefaultValue(controlType);

            string label = _Property.GetStringValue("Label");
            if (!string.IsNullOrEmpty(label))
            {
                this._Label = new Label(this._Property, this);
                this._ControlList.Add(_Label);
            }

            GetRightControl(controlType);
        }

        private void GetRightControl(string controlType)
        {
            switch (controlType)
            {
                case "Button":
                    {
                        _Button = new Button(_Property, this);
                        this._ControlList.Add(this._Button);
                        break;
                    }
                case "Password":
                default:
                    {
                        _TextBox = new TextBox(this._Property, this);
                        this._ControlList.Add(this._TextBox);
                        break;
                    }
            }
        }

        private void SetDefaultValue(string controlType)
        {
            this.SetDefaultValue("Width", 310);
            this.SetDefaultValue("Height", 40);
            this.SetDefaultValue("LabelWidth", 100);

            if (controlType.Equals("Button")) this.SetDefaultValue("ControlWidth", 60);
            else this.SetDefaultValue("ControlWidth", 200);
        }

        private void SetDefaultValue(string name, object value)
        {
            if (!this._Property.ContainsKey(name)) this._Property[name] = value;
        }

        public override object GetValue()
        {
            return this._ControlList[this._ControlList.Count - 1].GetValue();
        }

        public override void SetValue(object value)
        {
            this._ControlList[this._ControlList.Count - 1].SetValue(value);
        }

        public override bool ValidateNullable(out string message)
        {
            message = string.Empty;
            return this._ControlList[this._ControlList.Count - 1].ValidateNullable(out message);
        }
    }
}
