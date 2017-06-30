class ChartLine extends Chart {
    constructor(graph, options) {
        super(graph, options)

        this.Color = this.Color || "#000000"

    }

    GetShapeList() {
        const PointList = this.GetPonitList()
        let shapeList = [new LineShape(this.Context, {}, {
            PointList,
            StrokeColor: this.Color
        })]

        if (this.R > 0) {
            shapeList = shapeList.concat(PointList.map((p) => this.GetDot(p)))
        }

        shapeList = shapeList.concat(PointList.map((p) => this.GetValueText(p)))

        shapeList = shapeList.concat(PointList.map((p) => this.GetNameText(p)))

        return shapeList
    }

    GetValueText(p) {
        const shape = new TextShape(this.Context, p.Data, {
            X: p.X,
            Y: p.Y - 10,
            Text: p.Data.Value,
            TextAlign: "center"
        })

        return shape
    }

    GetNameText(p) {
        const shape = new TextShape(this.Context, p.Data, {
            X: p.X,
            Y: this.Height - 20,
            Text: p.Data.Name,
            TextAlign: "center"
        })

        return shape
    }

    GetDot(p) {
        return new CircleShape(this.Context, p.Data, {
            X: p.X,
            Y: p.Y,
            R: this.R,
            FillColor: this.Color
        })
    }

    GetPonitList() {
        if (this.PointList && this.PointList.length > 0) { return this.PointList }

        this.PointList = []

        if (this.Data && this.Data.length > 0) {

            this.PointWidth = this.Width / (this.Data.length)

            const minValue = this.GetMaxMinValue()
            const maxValue = this.GetMaxMinValue(false)
            if (maxValue > minValue) {
                this.UnitRadian = this.Height / (maxValue + minValue)
            }

            this.PointList = this.Data.map((item, i) => this.GetPoint(item, i))

        }

        return this.PointList
    }

    GetPoint(item, i) {
        return {
            X: this.PointWidth * (i + 1) - this.PointWidth / 2,
            Y: this.Height - item.Value * this.UnitRadian,
            R: this.R || 0,
            Data: item
        }
    }

    GetMaxMinValue(blMin) {
        blMin = blMin === undefined ? true : blMin
        let value = 0
        if (this.Data && this.Data.length > 0) {
            this.Data.forEach((item) => {
                if (blMin) {
                    if (value === 0) {
                        value = item.Value
                    }
                    else if (value >= item.Value) {
                        value = item.Value
                    }
                }
                else {
                    if (value < item.Value) {
                        value = item.Value
                    }
                }
            })
        }
        return value
    }

}