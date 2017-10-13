using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFramework.View
{
    public class Index
    {
        public object View { get; set; }

        public Index()
        {
            View = new
            {
                Text = "首页",
                Width = 1000,
                Height = 600,
                WindowsState = "Maximized"
            };
        }
    }
}
