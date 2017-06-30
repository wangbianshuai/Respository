class ChartPie extends Chart {
    constructor(graph, options) {
        super(graph, options)

        this.Anticlockwise = true

        if (this.Legend) this.Legend = Object.assign({}, this.Legend)
        this.Legend = this.Legend || { X: 0, Y: 0, Width: 0, Height: 0, R: 0, Space: 0, }

        if (this.TextLegend) this.TextLegend = Object.assign({}, this.TextLegend)
        this.TextLegend = this.TextLegend || { X: 0, Y: 0, Height: 0, Space: 0, }
    }

    GetShapeList() {
        this.MathCompute()

        this.ShapeList = []

        if (this.Data && this.Data.length > 0) {
            this.ShapeList = this.Data.map((item) => this.GetShape(item))
            this.CurrentAngle = this.StartAngle

            if (this.Legend && this.Legend.X > 0) {
                this.ShapeList = this.ShapeList.concat(this.Data.map((item) => this.GetLegendShape(item)))

                this.ShapeList = this.ShapeList.concat(this.Data.map((item) => this.GetTextShape(item)))
            }
        }

        return this.ShapeList
    }

    MathCompute() {
        //圆心
        this.X = this.X || this.Width / 2
        this.Y = this.Y || this.Height / 2

        //90角为开始角度
        this.StartAngle = this.StartAngle || - Math.PI / 180 * 90

        //单位弦度
        const sumValue = this.GetSumValue()
        this.UnitRadian = Math.PI * 2 / sumValue

        //正负
        this.Dir = this.Anticlockwise ? 1 : -1;
    }

    GetSumValue() {
        let sumValue = 0
        if (this.Data && this.Data.length > 0) {
            this.Data.forEach((item) => sumValue += item.Value)
        }
        return sumValue
    }

    GetShape(item) {
        this.CurrentAngle = this.CurrentAngle || this.StartAngle
        let angle = item.Value * this.UnitRadian
        const endAngle = this.CurrentAngle + this.Dir * angle

        const shape = new SectorShape(this.Context, item, {
            Cx: this.X,
            Cy: this.Y,
            StartAngle: this.CurrentAngle,
            EndAngle: endAngle,
            R1: this.R1,
            R2: this.R2 || 0,
            FillColor: item.Color,
            Anticlockwise: this.Anticlockwise
        })

        this.CurrentAngle = endAngle

        return shape
    }

    GetLegendShape(item) {
        const { X, Y, R, Width, Height, Space } = this.Legend

        const shape = new RectShape(this.Context, item, {
            X,
            Y,
            Width,
            Height,
            R,
            FillColor: item.Color
        })

        this.Legend.Y += Height + Space

        return shape
    }

    GetTextShape(item) {
        const { Height, Space, } = this.TextLegend
        const shape = new TextShape(this.Context, item, Object.assign(this.TextLegend, {
            Text: item.Name
        }))

        this.TextLegend.Y += Height + Space

        return shape
    }

    offclick(e) {
        if (this.SelectTextShape) {
            this.ClearRect(this.SelectTextShape.TextRect)
            this.SelectTextShape = null
        }
    }

    onclick(e, shape) {
        const { X, Y } = this
        this.SelectTextShape = new TextShape(this.Context, shape.Data, {
            X,
            Y,
            TextAlign: "center",
            Text: shape.Data.Name
        })

        this.SelectTextShape.Draw()
    }
}