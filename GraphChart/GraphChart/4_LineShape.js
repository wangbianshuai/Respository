//线
class LineShape extends Shape {
    constructor(context, data, options) {
        super(context, data, options)

        //options属性
        this.PointList = this.PointList || [] //坐标点集合
        this.LineJoin = this.LineJoin || "round"
    }

    BuildPath() {
        this.PointList.forEach((p, i) => {
            //move
            i === 0 ? this.Move(p.X, p.Y) : this.Line(p.X, p.Y)
        })
    }

    Contain(e) {
        let blContain = false
        for (let i = 1; i < this.PointList.length; i++) {
            if (this.JudgePointInLine(this.PointList[i - 1], this.PointList[i], e.Point)) {
                blContain = true
                break
            }
        }

        return blContain
    }

    JudgePointInLine(p1, p2, p) {
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0
        x1 = p1.X >= p2.X ? p2.X : p1.X
        x2 = p1.X >= p2.X ? p1.X : p2.X

        y1 = p1.Y >= p2.Y ? p2.Y : p1.Y
        y2 = p1.Y >= p2.Y ? p1.Y : p2.Y

        const { X, Y } = p
        //线宽度+1
        const lwidth = this.StrokeWidth + 1

        let blIn = false
        blIn = X >= x1 - lwidth && X <= x2 + lwidth
        blIn = blIn && Y >= y1 - lwidth && Y <= y2 + lwidth

        x1 = p1.X
        x2 = p2.X
        y1 = p1.Y
        y2 = p2.Y

        //垂直线
        if (blIn && x1 === x2) {
            blIn = Math.abs(X - x1) <= lwidth
        }

        //水平线
        if (blIn && y1 === y2) {
            blIn = Math.abs(Y - y1) <= lwidth
        }

        if (blIn) {
            const x = (Y - y1) / (y2 - y1) * (x2 - x1) + x1
            blIn = Math.abs(x - X) <= lwidth
        }

        return blIn
    }

}