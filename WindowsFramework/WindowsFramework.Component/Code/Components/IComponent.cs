using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Component.Code.Components
{
    public interface IComponent
    {
        /// <summary>
        /// 获取控件列表
        /// </summary>
        /// <returns></returns>
        List<System.Windows.Forms.Control> GetControls();

        /// <summary>
        /// 事件加载
        /// </summary>
        void EventLoad();

        /// <summary>
        /// 数据加载
        /// </summary>
        void DataLoad();

        object GetValue();

        void SetValue(object value);

        bool IsEdit();

        string GetName();

        bool ValidateNullable(out string message);
    }
}
