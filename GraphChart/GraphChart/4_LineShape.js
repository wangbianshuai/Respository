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
}