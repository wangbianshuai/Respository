//形状
class Shape {
    constructor(context, data, options) {
        this.Id = Common.CreateGuid()
        this.Context = context //Canvas Context
        this.Data = data //业务数据

        //options属性
        this.FillColor = "" //填充颜色
        this.StrokeColor = "" //笔触颜色
        this.StrokeWidth = 1 //笔触宽度
        this.LineJoin = "" //边角类型

        //形状设置选项
        if (options) { for (let key in options) { this[key] = options[key] } }
    }

    //画图
    Draw() {
        this.Context.save()

        if (this.IsText) {
            this.DrawText()
        }
        else {
            !this.IsRect && this.Context.beginPath()

            //绑定路径
            this.BuildPath()
            //设置样式
            this.SetStyle()
        }

        this.Context.restore()
    }

    SetProperty() { }

    DrawText() {
        this.SetProperty()

        if (this.FontColor) this.Context.fillStyle = this.FontColor
        if (this.Font) this.Context.font = this.Font
        if (this.TextAlign) this.Context.textAlign = this.TextAlign
        if (this.TextBaseline) this.Context.textBaseline = this.TextBaseline
        if (this.Text) this.Context.fillText(this.Text, this.X, this.Y)
    }

    GetTextWidth(text) {
        return this.Context.measureText(text).width
    }

    Move(x, y) {
        return this.SetPath("move", { X: x, Y: y })
    }

    Line(x, y) {
        return this.SetPath("line", { X: x, Y: y })
    }

    Rect(x, y, w, h) {
        return this.SetPath("rect", { X: x, Y: y, W: w, H: h })
    }

    Arc(x, y, r, sAngle, eAngle, anticlockwise) {
        return this.SetPath("arc", { X: x, Y: y, R: r, S: sAngle, E: eAngle, C: anticlockwise })
    }

    Bcurve(x1, y1, x2, y2, x, y) {
        return this.SetPath("bcurve", { X: x, Y: y, X1: x1, Y1: y1, X2: x2, Y2: y2 })
    }

    Qcurve(x1, y1, x, y) {
        return this.SetPath("qcurve", { X: x, Y: y, X1: x1, Y1: y1 })
    }

    Close() {
        return this.SetPath("close")
    }

    BuildPath() { }

    Contain(e) { return null }

    SetPath(t, p) {
        switch (t) {
            case "move":
                return this.Context.moveTo(p.X, p.Y)
            case "line":
                return this.Context.lineTo(p.X, p.Y)
            case "rect":
                return this.Context.rect(p.X, p.Y, p.W, p.H)
            case "arc":
                return this.Context.arc(p.X, p.Y, p.R, p.S, p.E, p.C)
            case "bcurve":
                return this.Context.bezierCurveTo(p.X1, p.Y1, p.X2, p.Y2, p.X, p.Y)
            case "qcurve":
                return this.Context.quadraticCurveTo(p.X1, p.Y1, p.X, p.Y)
            case "close":
                return this.Context.closePath()
        }
    }

    SetStyle() {
        if (this.FillColor) {
            this.Context.fillStyle = this.FillColor
            this.Context.fill()
        }

        if (this.StrokeColor) {
            this.Context.lineWidth = this.StrokeWidth
            if (this.LineJoin) { this.Context.lineJoin = this.LineJoin }
            this.Context.strokeStyle = this.StrokeColor
            this.Context.stroke()
        }
    }
}