//矩形
class RectShape extends Shape {
    constructor(context, data, options) {
        super(context, data, options)

        //options属性
        this.Y = this.Y || 0 //X
        this.X = this.X || 0 //y
        this.Width = this.Width || 0 //宽
        this.Height = this.Height || 0 //高
        this.R = this.R || 0 //圆角半径

        this.IsRect = this.R === 0
    }

    BuildPath() {
        const { X, Y, R, Width, Height } = this

        if (this.IsRect) {
            this.Rect(X, Y, Width, Height)
        }
        else {
            //move
            this.Move(X + R, Y)
            //line
            this.Line(X + Width - R, Y)
            //qcurve
            this.Qcurve(X + Width, Y, X + Width, Y + R)
            //line
            this.Line(X + Width, Y + Height - R)
            //qcurve
            this.Qcurve(X + Width, Y + Height, X + Width - R, Y + Height)
            //line
            this.Line(X + R, Y + Height)
            //qcurve
            this.Qcurve(X, Y + Height, X, Y + Height - R)
            //line
            this.Line(X, Y + R)
            //qcurve
            this.Qcurve(X, Y, X + R, Y)
            //Close
            this.Close()
        }
    }
}