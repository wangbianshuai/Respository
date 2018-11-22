using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Component.Code.Controls
{
    public class GroupBox : BaseControl, IControl
    {
        private System.Windows.Forms.GroupBox _GroupBox { get; set; }
        Components.GroupBoxComponent _GroupBoxComponent { get; set; }

        public GroupBox(Dictionary<string, object> property, Components.GroupBoxComponent groupBoxComponent)
        {
            _Property = property;
            _GroupBoxComponent = groupBoxComponent;
            _GroupBox = new System.Windows.Forms.GroupBox();
            this._Control = _GroupBox;
            this.SetProperty();
            this.SetProperty(_GroupBoxComponent._Form, _GroupBox, false, false);
        }

        private void SetProperty()
        {
            this.SetDefaultValue("TabStop", false);
        }

        protected override void SetProperty(string name, object value)
        {
            System.Windows.Forms.GroupBox t = _GroupBox;
            switch (name)
            {
                case "Name": t.Name = (string)value; break;
                case "Height": t.Height = (int)value; break;
                case "Dock": t.Dock= this.GetDock((string)value); break;
                case "TabStop": t.TabStop = (bool)value; break;
            }
        }

        /// <summary>
        /// 获取控件
        /// </summary>
        /// <returns></returns>
        public override System.Windows.Forms.Control GetControl()
        {
            return this._GroupBox;
        }

        public override bool ValidateNullable(out string message)
        {
            message = string.Empty;
           
           

            return true;
        }
    }
}
