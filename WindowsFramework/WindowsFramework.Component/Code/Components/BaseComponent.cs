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
        protected List<IControl> _ControlList { get; set; }
        public IForm _Form { get; set; }
        protected Dictionary<string, object> _Property { get; set; }

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
        }

        /// <summary>
        /// 数据加载
        /// </summary>
        public void DataLoad()
        {
            this._ControlList.ForEach(c => c.DataLoad());
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
    }
}
