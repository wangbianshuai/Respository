(function () {
    class Common {
        //创建GUID
        static CreateGuid() {
            var guid = ""
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16)
                guid += n
                if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
                    guid += "-"
                }
            }
            return guid
        }

        static BindEvent(ele, eventName, fn) {
            Common.RemoveEvent(ele, eventName, fn)
            Common.AddEvent(ele, eventName, fn)
        }

        static AddEvent(ele, eventName, fn) {
            if (ele.attachEvent) {
                ele.attachEvent('on' + eventName, fn)
            }
            else if (ele.addEventListener) {
                ele.addEventListener(eventName, fn, false)
            }
            else {
                ele["on" + eventName] = fn
            }
        }

        static RemoveEvent(ele, eventName, fn) {
            if (ele.detachEvent) {
                ele.detachEvent('on' + eventName, fn)
            }
            else if (ele.removeEventListener) {
                ele.removeEventListener(eventName, fn, false)
            }
            else {
                ele["on" + eventName] = null
            }
        }
    }


    class Chart {
        constructor(graph, options) {
            this.Id = Common.CreateGuid()
            this.Graph = graph
            this.Context = graph.GraphChart.CanvasContext
            this.Width = graph.GraphChart.Width
            this.Height = graph.GraphChart.Height

            if (options) { for (let key in options) { this[key] = options[key] } }
        }

        GetShapeList() { return [] }

        Draw() {
            this.ShapeList = this.GetShapeList()

            this.ShapeList.forEach((shape) => shape.Draw())
        }

        EventAction(name, e) {
            let n = `off${name}`
            this[n] && this[n](e)

            n = `on${name}`
            if (this[n]) {
                const shape = this.GetSelectShape(e)
                if (shape === null) { return }

                this[n](e, shape)
            }
        }

        GetSelectShape(e) {
            let shape = null

            for (let i = 0; i < this.ShapeList.length; i++) {
                if (this.ShapeList[i].Contain(e)) {
                    shape = this.ShapeList[i]
                    break
                }
            }

            return shape
        }

        ClearRect(rect) {
            this.Context.clearRect(rect.X, rect.Y, rect.Width, rect.Height)
        }
    }
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
    class ChartRect extends Chart {
        constructor(graph, options) {
            super(graph, options)
        }

        GetShapeList() {
            const { X, Y, Width, Height, R } = this
            return [new RectShape(this.Context, options.Data, { X, Y, Width, Height, R })]
        }
    }

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
    //圆
    class CircleShape extends Shape {
        constructor(context, data, options) {
            super(context, data, options)

            //options属性
            this.X = this.X || 0 //X
            this.Y = this.Y || 0 //y
            this.R = this.R || 0 //半径
        }

        BuildPath() {
            const { X, Y, R } = this

            this.Arc(X, Y, R, 0, Math.PI * 2, false)
        }
    }
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
    //扇形
    class SectorShape extends Shape {
        constructor(context, data, options) {
            super(context, data, options)

            //options属性
            this.Cx = this.Cx || 0 //圆心X
            this.Cy = this.Cy || 0 //圆心y
            this.R1 = this.R1 || 0 //半径1
            this.R2 = this.R2 || 0 //半径2
            this.StartAngle = this.StartAngle || 0 //开始角度
            this.EndAngle = this.EndAngle || 0 //结束角度
            this.Anticlockwise = this.Anticlockwise || true //是否逆时针方向
        }

        BuildPath() {
            const { Cx, Cy, R1, R2, StartAngle, EndAngle, Anticlockwise } = this

            let unitX = Math.cos(StartAngle)
            let unitY = Math.sin(StartAngle)

            //move
            this.Move(unitX * R2 + Cx, unitY * R2 + Cy)
            //line
            this.Line(unitX * R1 + Cx, unitY * R1 + Cy)
            //arc
            this.Arc(Cx, Cy, R1, StartAngle, EndAngle, !Anticlockwise)
            //line
            this.Line(Math.cos(EndAngle) * R2 + Cx, Math.sin(EndAngle) * R2 + Cy)
            //arc
            R2 !== 0 && this.Arc(Cx, Cy, R2, EndAngle, StartAngle, Anticlockwise)
            //close
            this.Close()
        }


        Contain(e) {
            const { X, Y } = e.Point
            const { Cx, Cy, R1, R2, StartAngle, EndAngle } = this
            const dx = X - Cx
            const dy = Y - Cy
            const r = Math.sqrt(dx * dx + dy * dy)

            let blContain = r <= R1 && r >= R2

            if (blContain) {
                const angle = Math.atan2(dy, dx);

                blContain = EndAngle > Math.PI && angle < 0
                    ? angle < -(Math.PI * 2 - EndAngle)
                    : angle >= StartAngle && angle <= EndAngle
            }

            return blContain
        }
    }
    //文本
    class TextShape extends Shape {
        constructor(context, data, options) {
            super(context, data, options)

            //options属性
            this.Text = this.Text || ""
            this.FontStyle = this.FontStyle || ""
            this.FontWeight = this.FontWeight || ""
            this.FontSize = this.FontSize || ""
            this.FontFamily = this.FontFamily || ""
            this.Font = this.Font || ""
            this.TextAlign = this.TextAlign || ""
            this.TextBaseline = this.TextBaseline || ""
            this.FontColor = this.FontColor || ""
            this.X = this.X || 0
            this.Y = this.Y || 0

            //font-style 规定字体样式。可能的值：normal italic oblique
            //font-variant 规定字体变体。可能的值：normal small-caps 
            //font-weight 规定字体的粗细。可能的值：normal bold bolder lighter 100 200 300 400 500 600 700 800 900
            //font-size / line-height	规定字号和行高，以像素计。
            //font-family
            //font	//设置或返回文本内容的当前字体属性
            //textAlign	//设置或返回文本内容的当前对齐方式
            //textBaseline	//设置或返回在绘制文本时使用的当前文本基线

            this.IsText = true

            this.GetTextRect()
        }

        SetProperty() {
            if (!this.Font) {
                let values = []

                this.FontStyle && values.push(this.FontStyle)
                this.FontWeight && values.push(this.FontWeight)
                this.FontSize && values.push(this.FontSize)
                this.FontFamily && values.push(this.FontFamily)

                this.Font = values.join(" ")
            }
        }

        GetTextRect() {

            this.TextWidth = this.GetTextWidth(this.Text)
            let x = this.X - 5, y = this.Y - 20

            if (this.TextAlign === "center") {
                x = x - this.TextWidth / 2
            }

            this.TextRect = { X: x, Y: y, Width: this.TextWidth + 10, Height: this.Height || 40 }
        }
    }
    class GraphType { }
    GraphType.Line = "line"
    GraphType.Pie = "pie"

    class Graph {
        constructor(graphChart, options) {
            this.Id = Common.CreateGuid()
            this.GraphChart = graphChart
            this.Options = options

            if (options) { for (let key in options) { this[key] = options[key] } }
        }

        Draw() {
            this.Chart = this.GetChart()
            if (this.Chart === null) { return }

            this.Chart.Draw()
        }

        EventAction(name, e) {
            this.Chart && this.Chart.EventAction(name, e)
        }

        GetChart() {
            switch (this.Type) {
                case GraphType.Line:
                    return new ChartLine(this, this.Options)
                case GraphType.Pie:
                    return new ChartPie(this, this.Options)
                default: return null
            }
        }
    }
    class GraphChart {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.GraphList = []

            if (options) { for (let key in options) { this[key] = options[key] } }

            this.Init()
        }

        Init() {
            const html = `<canvas id="${this.Id}" width="${this.Width}" height="${this.Height}"></canvas>`
            let ele = document.getElementById(this.TagId)
            if (!ele) { return }
            ele.innerHTML = html

            ele = document.getElementById(this.Id)
            if (ele && ele.getContext) {
                this.CanvasContext = ele.getContext("2d")

                if (this.EventNames && this.EventNames.length > 0) {
                    this.EventNames.forEach((name) => Common.BindEvent(ele, name, (e) => this.EventAction(name, e)))
                }
            }
        }

        EventAction(name, e) {
            const rect = e.target.getBoundingClientRect()
            e.Point = { X: e.pageX - rect.left, Y: e.pageY - rect.top }

            this.GraphList.forEach((g) => g.EventAction(name, e))
        }

        Draw(options) {
            if (!this.CanvasContext) { return }

            let graph = null
            if (options && options.length > 0) {
                options.forEach((item) => {
                    graph = new Graph(this, item)
                    graph.Draw()
                    this.GraphList.push(graph)
                })
            }
        }
    }
    window.GraphChart = GraphChart
})()
