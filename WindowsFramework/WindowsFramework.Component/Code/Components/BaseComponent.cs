using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFramework.Component.Code.Controls;
using WindowsFramework.Component.Code.Forms;
using WindowsFramework.Utility;

namespace WindowsFramework.Component.Code.Components
{
    public class BaseComponent : IComponent
    {
        protected List<IComponent> _ComponentList { get; set; }
        protected List<IControl> _ControlList { get; set; }
        public IForm _Form { get; set; }
        protected Dictionary<string, object> _Property { get; set; }
        protected Dictionary<string, object> _View { get; set; }
        protected List<Dictionary<string, object>> _PropertyList { get; set; }

        /// <summary>
        /// 获取控件列表
        /// </summary>
        /// <returns></returns>
        public List<System.Windows.Forms.Control> GetControls()
        {
            return this._ControlList.Select(s => s.GetControl()).ToList();
        }

        /// <summary>
        /// 事件加载
        /// </summary>
        public void EventLoad()
        {
            this._ControlList.ForEach(c => c.EventLoad());
            if (_ComponentList != null) this._ComponentList.ForEach(c => c.EventLoad());
        }

        /// <summary>
        /// 数据加载
        /// </summary>
        public void DataLoad()
        {
            this._ControlList.ForEach(c => c.DataLoad());
            if (_ComponentList != null) this._ComponentList.ForEach(c => c.DataLoad());
        }


        public virtual object GetValue()
        {
            return null;
        }

        public virtual void SetValue(object value)
        {
        }

        public bool IsEdit()
        {
            return _Property.GetValue<bool>("IsEdit");
        }

        public string GetName()
        {
            return _Property.GetStringValue("Name");
        }

        public virtual bool ValidateNullable(out string message)
        {
            message = string.Empty;
            return true;
        }

        protected void SetView()
        {
            this._View = _Property.GetValue<Dictionary<string, object>>("View");
            if (this._View != null) this._PropertyList = this._View.GetValue<List<Dictionary<string, object>>>("Properties");
            this.SetPropertyList(this._PropertyList);
        }

        protected void SetPropertyList(List<Dictionary<string, object>> dictList)
        {
            if (dictList == null) return;
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
                case "GroupBox": this._ComponentList.Add(new GroupBoxComponent(dict, this._Form)); break;
                default: this._ComponentList.Add(new PropertyItem(dict, this._Form)); break;
            }
        }

        /// <summary>
        /// 获取控件列表
        /// </summary>
        /// <returns></returns>
        protected List<System.Windows.Forms.Control> GetComponentsControls()
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
    }
}
