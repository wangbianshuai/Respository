package Utility;

/**
 * Created by BianzhaiWang on 2017/1/12.
 */
public class Stopwatch {
    private long _StartMilliseconds = 0;
    private long _EndMilliseconds = 0;
    private boolean IsStop = false;

    public long ElapsedMilliseconds() {
        if (!this.IsStop) {
            this._EndMilliseconds = System.currentTimeMillis();
        }
        return this._EndMilliseconds - this._StartMilliseconds;
    }

    public void Start() {
        this.IsStop = false;
        this._StartMilliseconds = System.currentTimeMillis();
        this._EndMilliseconds = 0;
    }

    public void Stop() {
        this.IsStop = true;
        this._EndMilliseconds = System.currentTimeMillis();
    }
}
