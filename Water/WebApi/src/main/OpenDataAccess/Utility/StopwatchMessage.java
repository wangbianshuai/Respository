package OpenDataAccess.Utility;


import java.util.Date;

/**
 * Created by BianzhaiWang on 2017/1/12.
 */
public class StopwatchMessage {
    private Stopwatch _Stopwatch = null;
    private Date _StartTime = null;
    private long _LastElapsedMilliseconds = 0;
    private long _LastElapsedMilliseconds2 = 0;
    public long ElapsedMilliseconds = 0;

    public StopwatchMessage() {
        _Stopwatch = new Stopwatch();
        _StartTime = new Date();
        _Stopwatch.Start();
        _LastElapsedMilliseconds = 0;
        _LastElapsedMilliseconds2 = 0;
    }

    /// 步骤耗时
    public String StepElapsed() {
        long curElapsed = _Stopwatch.ElapsedMilliseconds();
        long elapsed = curElapsed - _LastElapsedMilliseconds;
        _LastElapsedMilliseconds = curElapsed;
        _LastElapsedMilliseconds2 = _LastElapsedMilliseconds;
        return String.format("执行耗时：%s毫秒。", elapsed);
    }

    public String ChildStepElapsed() {
        long curElapsed = _Stopwatch.ElapsedMilliseconds();
        long elapsed = curElapsed - _LastElapsedMilliseconds2;
        _LastElapsedMilliseconds2 = curElapsed;
        return String.format("执行耗时：%s毫秒。", elapsed);
    }

    public String EndElapsed() {
        Date endTime = new Date();
        _Stopwatch.Stop();
        long curElapsed = _Stopwatch.ElapsedMilliseconds();
        this.ElapsedMilliseconds = curElapsed;
        return String.format("执行时间：%s - %s，总耗时：%s毫秒。",
                Common.DateToString(_StartTime, AppSettings.DateFormat),
                Common.DateToString(endTime, AppSettings.DateFormat), curElapsed);
    }
}