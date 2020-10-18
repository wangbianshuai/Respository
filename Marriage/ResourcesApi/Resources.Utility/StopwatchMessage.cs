using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

namespace Resources.Utility
{
    public class StopwatchMessage
    {
        private Stopwatch _Stopwatch { get; set; }
        private DateTime _StartTime { get; set; }
        private long _LastElapsedMilliseconds { get; set; }
        private long _LastElapsedMilliseconds2 { get; set; }
        public long ElapsedMilliseconds { get; set; }

        public StopwatchMessage()
        {
            _Stopwatch = new Stopwatch();
            _StartTime = DateTime.Now;
            _Stopwatch.Start();
            _LastElapsedMilliseconds = 0;
            _LastElapsedMilliseconds2 = 0;
        }

        /// <summary>
        /// 步骤耗时
        /// </summary>
        /// <returns></returns>
        public string StepElapsed()
        {
            long elapsed = _Stopwatch.ElapsedMilliseconds - _LastElapsedMilliseconds;
            _LastElapsedMilliseconds = _Stopwatch.ElapsedMilliseconds;
            _LastElapsedMilliseconds2 = _LastElapsedMilliseconds;
            return string.Format("执行耗时：{0}毫秒。", elapsed);
        }

        public string ChildStepElapsed()
        {
            long elapsed = _Stopwatch.ElapsedMilliseconds - _LastElapsedMilliseconds2;
            _LastElapsedMilliseconds2 = _Stopwatch.ElapsedMilliseconds;
            return string.Format("执行耗时：{0}毫秒。", elapsed);
        }

        public string EndElapsed()
        {
            DateTime endTime = DateTime.Now;
            _Stopwatch.Stop();
            this.ElapsedMilliseconds = _Stopwatch.ElapsedMilliseconds;
            return string.Format("执行时间：{0} - {1}，总耗时：{2}毫秒。", _StartTime.ToString("yyyy-MM-dd HH:mm:ss.fff"), endTime.ToString("yyyy-MM-dd HH:mm:ss.fff"), _Stopwatch.ElapsedMilliseconds);
        }
    }
}
