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
            this.CurrentAngle = this.StartAngle
            this.ShapeList = this.Data.map((item, i) => this.GetShape(item, i === this.Data.length - 1))
            this.CurrentAngle = this.StartAngle

            if (this.IsLine) {
                const lineShapeList = []
                this.ShapeList.forEach((item) => this.GetSectorLine(lineShapeList, item))
                this.ShapeList = this.ShapeList.concat(lineShapeList)
            }

            if (this.Legend && this.Legend.X > 0) {
                this.ShapeList = this.ShapeList.concat(this.Data.map((item) => this.GetLegendShape(item)))

                this.ShapeList = this.ShapeList.concat(this.Data.map((item) => this.GetTextShape(item)))
            }
        }

        if (this.TextData && this.TextData.length > 0) {
            this.ShapeList = this.ShapeList.concat(this.TextData.map((item) => this.GetCenterTextShape(item)))
        }

        if (this.BottomPoints && this.BottomPoints.length > 0) {
            this.ShapeList = this.ShapeList.concat(this.BottomPoints.map((item) => this.GetBottomPointShape(item)))
        }

        return this.ShapeList
    }

    GetBottomPointShape(item) {
        let x = this.X + item.X
        let y = this.Y + item.Y

        return new CircleShape(this.Context, item, {
            X: x,
            Y: y,
            R: item.R,
            FillColor: item.Color
        })
    }

    GetSectorLine(lineShapeList, shape) {
        shape.ComputeLineRPiont()

        if (!shape.IsLabel) return

        lineShapeList.push(new LineShape(this.Context, {}, {
            PointList: shape.LinePointList,
            StrokeColor: shape.FillColor
        }))

        lineShapeList.push(new CircleShape(this.Context, shape.Data, {
            X: shape.LineX,
            Y: shape.LineY,
            R: this.LineR,
            FillColor: shape.FillColor
        }))

        let text = shape.Data.Name

        lineShapeList.push(new TextShape(this.Context, shape.Data, {
            X: shape.LineTextX1,
            Y: shape.LineTextY1,
            Text: text,
            TextAlign: "center",
            Font: this.LineTextFont,
            FontColor: shape.FillColor
        }))

        let value = shape.Data.TextValue || shape.Data.Value
        text = (this.IsCurrency ? Common.ToCurrency(value, false) : value)
        if (this.UnitName) text += this.UnitName
        let width = Math.round(this.GetTextWidth(text)) + 10
        let x = shape.LineTextX2
        if (shape.LineTextX2 + width > this.Width - 2) {
            x = this.Width - 2 - width
        }

        let valueOptions = {
            X: x,
            Y: shape.LineTextY2,
            Text: text,
            Font: this.LineTextFont,
            FontColor: shape.FillColor
        }

        if (this.IsValueCenter) {
            valueOptions.X = shape.LineTextX1
            valueOptions.TextAlign = "center"
        }

        lineShapeList.push(new TextShape(this.Context, shape.Data, valueOptions))
    }

    MathCompute() {
        //圆心
        this.X = this.X || this.Width / 2
        this.Y = this.Y || this.Height / 2

        if (this.MoveY) this.Y = this.Y + this.MoveY

        //90角为开始角度
        this.StartAngle = this.StartAngle || - Math.PI / 180 * 90

        //单位弦度
        const sumValue = this.GetSumValue()
        this.UnitRadian = Math.PI * 2 / sumValue

        let sumRate = 0
        if (this.Data && this.Data.length > 0) {
            this.Data.forEach((item, i) => {
                if (i === this.Data.length - 1) {
                    item.Rate = (100 - sumRate).toFixed(2)
                }
                else {
                    item.Rate = (item.Value * 100 / sumValue).toFixed(2)
                    sumRate += parseFloat(item.Rate)
                }
            })
        }

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

    GetShape(item, isLast) {
        let angle = item.Value * this.UnitRadian
        let endAngle = this.CurrentAngle + this.Dir * angle
        if (isLast) endAngle = (Math.PI * 2 + this.StartAngle) * this.Dir

        const shape = new SectorShape(this.Context, item, {
            Cx: this.X,
            Cy: this.Y,
            StartAngle: this.CurrentAngle,
            EndAngle: endAngle,
            R1: this.R1,
            R2: this.R2 || 0,
            FillColor: item.Color,
            Anticlockwise: this.Anticlockwise,
            IsLabel: item.IsLabel === undefined ? true : item.IsLabel
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

    GetCenterTextShape(item) {
        let x = this.X + item.X
        let y = this.Y + item.Y

        return new TextShape(this.Context, item, {
            X: x,
            Y: y,
            TextAlign: "center",
            Text: item.Text,
            Font: item.Font,
            FontColor: item.Color
        })
    }

    offclick(e) {
    }

    onclick(e, shape) {
        if (this.ClickAction) {
            new Function("e", "shape", this.ClickAction)(e, shape)
        }
    }
}