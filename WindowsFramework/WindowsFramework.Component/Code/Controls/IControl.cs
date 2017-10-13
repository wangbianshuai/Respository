using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Component.Code.Controls
{
    public interface IControl
    {
        /// <summary>
        /// 获取控件
        /// </summary>
        /// <returns></returns>
        System.Windows.Forms.Control GetControl();

        /// <summary>
        /// 事件加载
        /// </summary>
        void EventLoad();

        /// <summary>
        /// 数据加载
        /// </summary>
        void DataLoad();

        /// <summary>
        /// 设置位置
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        void SetLocation(int x, int y);

        Dictionary<string, object> GetProperty();

        object GetValue();

        void SetValue(object value);

        bool ValidateNullable(out string message);
    }
}
