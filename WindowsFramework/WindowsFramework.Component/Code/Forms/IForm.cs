using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.Component.Code.Forms
{
    public interface IForm
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

        System.Drawing.Point StartPoint { get; set; }

        int TabIndex { get; set; }

        /// <summary>
        /// 事件调用
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <param name="control"></param>
        void EventInvoke(object sender, EventArgs e, Controls.IControl control);

        System.Windows.Forms.Form ParentForm { get; set; }
    }
}
