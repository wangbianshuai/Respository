using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MouseSync.Code
{
    public class KeyboardMouse
    {
        public KeyboardMouseHook KeyboardMouseHook { get; set; }

        ~KeyboardMouse()
        {
            if (_MouseOveTimer != null)
            {
                _MouseOveTimer.Stop();
                _MouseOveTimer = null;
            }
        }

        public KeyboardMouse()
        {
            KeyboardMouseHook = new KeyboardMouseHook();

            KeyboardMouseHook.KeyUp += KeyboardMouseHook_KeyUp;

            KeyboardMouseHook.MouseDown += KeyboardMouseHook_MouseDown;
            KeyboardMouseHook.MouseUp += KeyboardMouseHook_MouseUp;

            _MouseOveTimer = new System.Timers.Timer();
            _MouseOveTimer.Interval = 50;
            _MouseOveTimer.Elapsed += _MouseOveTimer_Elapsed;
            _MouseOveTimer.Start();

            _MousePoint = new Mouse();
        }

        public double Width { get; set; }
        public double Height { get; set; }

        void _MouseOveTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            Mouse mouse = new Mouse();

            Win32Api.Point curPos;

            Win32Api.GetCursorPos(out curPos);

            mouse.X = curPos.X;
            mouse.Y = curPos.Y;
            mouse.Width = Width;
            mouse.Height = Height;

            if (mouse.X == _MousePoint.X && mouse.Y == _MousePoint.Y) return;

            _MousePoint = mouse;
        }

        Mouse _MousePoint { get; set; }

        System.Timers.Timer _MouseOveTimer { get; set; }

        void KeyboardMouseHook_MouseUp(object sender, System.Windows.Forms.MouseEventArgs e)
        {
            Mouse mouse = new Mouse();
            mouse.X = e.X;
            mouse.Y = e.Y;
            mouse.Width = Width;
            mouse.Height = Height;
            mouse.Button = (int)e.Button;

        }

        void KeyboardMouseHook_MouseDown(object sender, System.Windows.Forms.MouseEventArgs e)
        {
            Mouse mouse = new Mouse();
            mouse.X = e.X;
            mouse.Y = e.Y;
            mouse.Width = Width;
            mouse.Height = Height;
            mouse.Button = (int)e.Button;

        }

        void KeyboardMouseHook_KeyUp(object sender, System.Windows.Forms.KeyEventArgs e)
        {
            if (e.Handled) return;

        }

        void KeyboardMouseDispatchResponse(object data, int actionType)
        {
            try
            {
                SetKeyboardMouseReceiveData(data, actionType);
            }
            catch (Exception ex)
            {
                //Utils.Common.Alert("KeyboardMouse", "KeyboardMouseDispatchResponse", ex);
            }
        }

        void SetKeyboardMouseReceiveData(object data, int actionType)
        {
        }

        void SetKeyUp(object data)
        {
            if (data == null) return;

            int keyCode = Convert.ToInt32(data);

            System.Windows.Input.Key key = System.Windows.Input.KeyInterop.KeyFromVirtualKey((int)keyCode);
            //Utils.KeyboardAction.Press(key);
        }

        void SetMouseDown(object data)
        {
            if (data == null) return;

            //Entity.Data.Controls.Mouse mouse = GetMouse(data);

            //Utils.MouseAction.MoveTo(new System.Drawing.Point(mouse.X, mouse.Y));

            //Utils.MouseAction.Down(GetMouseButton(mouse.Button));
        }

        //Entity.Data.Controls.Mouse GetMouse(object data)
        //{
        //    Entity.Data.Controls.Mouse mouse = data as Entity.Data.Controls.Mouse;

        //    if (Width != mouse.Width)
        //    {
        //        mouse.X = Convert.ToInt32(mouse.X * Width / mouse.Width);
        //        mouse.Y = Convert.ToInt32(mouse.Y * Height / mouse.Height);
        //    }

        //    return mouse;
        //}

        void SetMouseMove(object data)
        {
            if (data == null) return;

          //  Entity.Data.Controls.Mouse mouse = GetMouse(data);

           // Utils.MouseAction.MoveTo(new System.Drawing.Point(mouse.X, mouse.Y));
        }

        void SetMouseUp(object data)
        {
            if (data == null) return;

            //Entity.Data.Controls.Mouse mouse = GetMouse(data);

            //Utils.MouseAction.MoveTo(new System.Drawing.Point(mouse.X, mouse.Y));

            //Utils.MouseAction.Up(GetMouseButton(mouse.Button));
        }

        System.Windows.Input.MouseButton GetMouseButton(int button)
        {
            switch ((System.Windows.Forms.MouseButtons)button)
            {
                case System.Windows.Forms.MouseButtons.Left: return System.Windows.Input.MouseButton.Left;
                case System.Windows.Forms.MouseButtons.Middle: return System.Windows.Input.MouseButton.Middle;
                case System.Windows.Forms.MouseButtons.Right: return System.Windows.Input.MouseButton.Right;
                case System.Windows.Forms.MouseButtons.XButton1: return System.Windows.Input.MouseButton.XButton1;
                case System.Windows.Forms.MouseButtons.XButton2: return System.Windows.Input.MouseButton.XButton2;
                default: return System.Windows.Input.MouseButton.Left;
            }
        }
    }
}
