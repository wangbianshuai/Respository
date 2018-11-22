using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Component.Code.Forms;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Components
{
    public class GroupBoxComponent : BaseComponent, IComponent
    {
        Controls.GroupBox _GroupBox { get; set; }

        public GroupBoxComponent(Dictionary<string, object> property, IForm form)
        {
            _Property = property;
            _Form = form;

            this._ControlList = new List<Controls.IControl>();

            _GroupBox = new Controls.GroupBox(_Property, this);
            this._ControlList.Add(_GroupBox);

            _ComponentList = new List<IComponent>();
            SetView();
            this._GroupBox.GetControl().Controls.AddRange(this.GetComponentsControls().ToArray());
        }

        public override object GetValue()
        {
            return null;
        }

        public override void SetValue(object value)
        {
          
        }

        public override bool ValidateNullable(out string message)
        {
            message = string.Empty;
            return true;
        }
    }
}
