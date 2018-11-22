class ChartLine extends Chart {
    constructor(graph, options) {
        super(graph, options)

        this.Color = this.Color || "#000000"
        this.Top = this.Top || 10
        this.Bottom = this.Bottom || 20
        this.MaxValueY = this.MaxValueY || 35
        this.BottomLineY = this.BottomLineY || 35
        this.MinValueY = this.MinValueY || this.Height - this.BottomLineY - this.R
    }

    GetShapeList() {
        const PointList = this.GetPonitList()
        this.PointList = PointList
        let shapeList = [new LineShape(this.Context, {}, {
            PointList,
            StrokeColor: this.Color
        })]

        shapeList = shapeList.concat(this.GetFillLineQuadrangleList(PointList))

        shapeList = shapeList.concat(PointList.map((p) => this.GetYLine(p)))

        if (this.R > 0) {
            shapeList = shapeList.concat(PointList.map((p) => this.GetDot(p)))
        }

        this.PreMoveY = false
        shapeList = shapeList.concat(PointList.map((p, i) => this.GetValueText(p, i)))

        shapeList.push(this.GetBottomLine(PointList))

        shapeList = shapeList.concat(PointList.map((p) => this.GetNameText(p)))

        return shapeList
    }

    GetFillLineQuadrangleList(pointList) {
        const shapeList = []
        for (let i = 1; i < pointList.length; i++) {
            shapeList.push(this.GetFillLineQuadrangle(pointList[i - 1], pointList[i]))
        }
        return shapeList
    }

    GetFillLineQuadrangle(p1, p2) {
        const pList = []
        pList.push(p1)
        pList.push(p2)
        pList.push({ X: p2.X, Y: this.Height - this.BottomLineY })
        pList.push({ X: p1.X, Y: this.Height - this.BottomLineY })
        return new Quadrangle(this.Context, {}, { PointList: pList, FillColor: this.FillLineColor })
    }

    GetYLine(p) {
        const pList = []
        const x = this.GetVHLinePointValue(p.X)
        pList.push({ X: x, Y: this.Top })
        pList.push({ X: x, Y: this.Height - this.BottomLineY })

        return new LineShape(this.Context, {}, {
            PointList: pList,
            StrokeColor: this.DashLineColor,
            IsDash: true
        })
    }

    GetBottomLine(pointList) {
        const pList = []
        const x = Math.round(this.PointWidth / 4)

        const y = this.GetVHLinePointValue(this.Height - this.BottomLineY)

        pList.push({ X: pointList[0].X - x, Y: y })
        pList.push({ X: pointList[pointList.length - 1].X + x, Y: y })

        return new LineShape(this.Context, {}, {
            PointList: pList,
            StrokeColor: this.BottomLineColor
        })
    }

    GetValueText(p, i) {
        let my = 0
        if (i > 0) {
            const prePoint = this.PointList[i - 1]
            if (!this.PreMoveY && Math.abs(prePoint.Y - p.Y) < 10) {
                my = -20
            }
        }

        const text = this.IsCurrency ? Common.ToCurrency(p.Data.Value, false) : p.Data.Value
        const width = Math.floor(this.GetTextWidth(text)) + 2

        let y = p.Y - 10
        if ((width > this.PointWidth || this.PointWidth - width < 10) && my !== 0) {
            y = p.Y + my
            this.PreMoveY = true
        }
        else {
            this.PreMoveY = false
        }

        let x = p.X - width / 2 < 2 ? 2 + Math.round(width / 2) : p.X
        if ((p.X + width / 2) - (this.Width - 5) > 0) {
            x = Math.round(this.Width - width / 2) - 5
        }

        const shape = new TextShape(this.Context, p.Data, {
            X: x,
            Y: y,
            Text: text,
            TextAlign: "center",
            Font: this.ValueFont,
            FontColor: this.ValueColor
        })

        return shape
    }

    GetNameText(p) {
        const shape = new TextShape(this.Context, p.Data, {
            X: p.X,
            Y: this.Height - this.Bottom,
            Text: p.Data.Name,
            TextAlign: "center",
            Font: this.NameFont,
            FontColor: this.NameColor
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

            this.PointWidth = Math.round(this.Width / (this.Data.length))

            const minValue = this.GetMaxMinValue()
            const maxValue = this.GetMaxMinValue(false)

            if (maxValue > minValue) {
                this.Ratio = 1
                this.GetRatio(maxValue)

                this.UnitRadian = (this.MinValueY - this.MaxValueY) * this.Ratio / maxValue
            }
            else {
                this.UnitRadian = 0
                this.Ratio = 1
            }

            this.PointList = this.Data.map((item, i) => this.GetPoint(item, i, minValue))

            for (let i = 1; i < this.PointList.length; i++) {
                this.ComputeLinePoint(this.PointList[i - 1], this.PointList[i])
            }

            this.PointList = this.PointList.map((p) => {
                p.X = p.X2 === undefined ? p.X : p.X2
                p.Y = p.Y2 === undefined ? p.Y : p.Y2
                return p
            })
        }

        return this.PointList
    }

    GetRatio(maxValue) {
        if (maxValue < 1000) {
            return
        }
        this.Ratio = this.Ratio * 10
        this.GetRatio(maxValue / 10)
    }

    GetPoint(item, i, minValue) {
        let x = this.PointWidth * (i + 1) - this.PointWidth / 2
        let y = Math.round(this.MinValueY - item.Value / this.Ratio * this.UnitRadian)
        y = item.Value > 0 && (this.MinValueY - y) < 1 ? this.MinValueY - 1 : y

        return {
            X: x,
            Y: y,
            R: this.R || 0,
            Data: item
        }
    }

    GetMaxMinValue(blMin) {
        blMin = blMin === undefined ? true : blMin
        let value = 0
        if (this.Data && this.Data.length > 0) {
            this.Data.forEach((item, i) => {
                if (blMin) {
                    if (i === 0) {
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