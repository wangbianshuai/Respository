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

        //字符串转化成货币显示格式 
        static ToCurrency(value, blFixed2) {
            blFixed2 = blFixed2 === undefined ? true : blFixed2
            var floatValue = parseFloat(value)
            if (isNaN(floatValue)) {
                return value
            }
            else {
                var flString = blFixed2 ? floatValue.toFixed(2) : floatValue.toString()
                var r = /(\d+)(\d{3})/
                while (r.test(flString)) {
                    flString = flString.replace(r, "$1,$2")
                }
                return flString
            }
        }


        static BindEvent(ele, eventName, fn, blUnbind) {
            if (!ele) return;

            let eventNames = eventName.split(".");
            let name = "";
            if (eventNames.length === 2) {
                eventName = eventNames[0];
                name = eventNames[1];
            }
            else {
                name = eventName;
            }

            if (ele["Event_" + eventName] === undefined) {
                ele["Event_" + eventName] = {
                    EventAction: (e) => {
                        let rv = true, rv2 = null
                        eventObj.EventList.forEach(ev => { rv2 = ev.Action(e); if (rv2 === false) rv = rv2; })
                        if (rv === false) { e.preventDefault(); e.returnValue = rv; e.cancel = !rv; }
                    },
                    EventList: []
                };
            }

            let eventObj = ele["Event_" + eventName];

            if (blUnbind) {
                if (eventObj.EventList.length === 1) {
                    Common.RemoveEvent(ele, eventName, eventObj.EventAction)
                    eventObj.EventList = [];
                }
                else {
                    let index = -1;
                    for (let i = 0; i < eventObj.EventList.length; i++) {
                        if (eventObj.EventList[i].Name === name) { index = i; break; }
                    }
                    if (index >= 0) eventObj.EventList.splice(index, 1);
                }
            }
            else {
                let list = eventObj.EventList.filter(f => f.Name === name);
                list.length === 0 && eventObj.EventList.push({ Name: name, Action: fn });

                if (eventObj.EventList.length === 1) Common.AddEvent(ele, eventName, eventObj.EventAction);
            }
        }

        static OffBindEvent(ele, eventName) {
            Common.BindEvent(ele, eventName, null, true);
        }

        static AddEvent(ele, eventName, fn) {
            if (ele.addEventListener) {
                ele.addEventListener(eventName, fn, false)
            }
            else if (ele.attachEvent) {
                ele.attachEvent('on' + eventName, fn)
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

        static GetNumber(value, scale) {
            let f = parseFloat(value)
            if (isNaN(f)) return value

            scale = (scale || 2) * 10
            return Math.floor(f * scale) / scale
        }

        static IsArray(obj) {
            if (obj === null || obj === undefined) return false
            return typeof (obj) === "object" && obj.length >= 0
        }

        static IsObject(obj) {
            if (obj === null || obj === undefined) return false
            return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length
        }

        static Assign(a, b, c) {
            if (!Common.IsObject(a)) return a

            const objList = []
            if (Common.IsObject(b)) for (let k in b) a[k] = Common.Clone(b[k], objList)

            if (Common.IsObject(c)) for (let k in c) a[k] = Common.Clone(c[k], objList)

            return a
        }

        static ArrayClone(a, objList) {
            if (!Common.IsArray(a)) return a

            var dataList = []
            for (var i = 0; i < a.length; i++) {
                dataList.push(Common.Clone(a[i], objList))
            }
            return dataList
        }

        static Clone(a, objList) {
            if (Common.IsArray(a)) return Common.ArrayClone(a, objList)

            if (!Common.IsObject(a)) return a

            var blExists = false
            for (var i = 0; i < objList.length; i++) {
                if (objList[i] === a) {
                    blExists = true
                    break
                }
            }

            if (blExists) return a

            objList.push(a)

            var c = {}

            for (var key in a) {
                if (Common.IsArray(a[key])) {
                    c[key] = Common.ArrayClone(a[key], objList)
                }
                else if (Common.IsObject(a[key])) {
                    c[key] = Common.Clone(a[key], objList)
                }
                else {
                    c[key] = a[key]
                }
            }

            return c
        }
    }

    if (!Object.assign) Object.assign = Common.Assign;

    class Chart {
        constructor(graph, options) {
            this.Id = Common.CreateGuid()
            this.Graph = graph
            this.Context = graph.GraphChart.CanvasContext
            this.Width = graph.GraphChart.Width
            this.Height = graph.GraphChart.Height
            this.CanvasWidth = graph.GraphChart.CanvasWidth
            this.CanvasHeight = graph.GraphChart.CanvasHeight

            if (options) { for (let key in options) { this[key] = options[key] } }

            if (this.BackColor) this.DrawBackground()
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

        DrawBackground() {
            this.Context.save()
            this.Context.rect(0, 0, this.CanvasWidth, this.CanvasHeight)
            this.Context.fillStyle = this.BackColor
            this.Context.fill()
            this.Context.restore()
        }

        GetTextWidth(text) {
            return this.Context.measureText(text).width
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

        ComputeLinePoint(p1, p2) {
            if (p1.X === p2.X || p1.Y === p2.Y) {
                if (p1.X === p2.X) {
                    p1.X2 = p2.X2 = this.GetVHLinePointValue(p1.X)
                }
                if (p1.Y === p2.Y) {
                    p1.Y2 = p2.Y2 = this.GetVHLinePointValue(p1.Y)
                }
            }
        }

        GetVHLinePointValue(value) {
            value = Math.round(value * 2)
            if ((value + 1) % 2 === 0) {
                return value / 2
            }
            else {
                return (value + 1) / 2
            }
        }
    }
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
    //形状
    class Shape {
        constructor(context, data, options) {
            this.Id = Common.CreateGuid()
            this.Context = context //Canvas Context
            this.Data = data //业务数据
            this.Ratio = window.devicePixelRatio || 1

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
            if (this.Font) {
                this.SetRadioFont()
                this.Context.font = this.Font
            }
            if (this.TextAlign) this.Context.textAlign = this.TextAlign
            if (this.TextBaseline) this.Context.textBaseline = this.TextBaseline
            if (this.Text) this.Context.fillText(this.Text, this.X * this.Ratio, this.Y * this.Ratio)
        }

        SetRadioFont() {
            if (this.Ratio > 1) {
                let items = this.Font.split(" ")
                let size = items[0]
                if (size.indexOf("px") > 0) {
                    size = parseFloat(size.replace("px", "")) * this.Ratio + "px"
                    items[0] = size
                }
                this.Font = items.join(" ")
            }
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

        SetRatioValue(p, r) {
            if (r <= 1 || !p) {
                return
            }

            this.GetRatioValue(p, "X", r)
            this.GetRatioValue(p, "Y", r)
            this.GetRatioValue(p, "X1", r)
            this.GetRatioValue(p, "Y1", r)
            this.GetRatioValue(p, "X2", r)
            this.GetRatioValue(p, "Y2", r)
            this.GetRatioValue(p, "W", r)
            this.GetRatioValue(p, "H", r)
            this.GetRatioValue(p, "R", r)
        }

        GetRatioValue(p, k, r) {
            const v = p[k]
            if (!v) { return }
            const v2 = Math.floor(v)
            if (v - v2 === 0.5 && r !== 3 && r !== 5) {
                p[k] = Math.floor(v * r) + 0.5
            }
            else {
                p[k] = v * r
            }
        }

        SetPath(t, p) {
            this.SetRatioValue(p, this.Ratio)
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

        Save() {
            this.Context.save()
        }

        Translate(x, y) {
            x = x * this.Ratio
            y = y * this.Ratio
            this.Context.translate(x, y)
        }

        BeginPath() {
            this.Context.beginPath()
        }

        Restore() {
            this.Context.restore()
        }

        Rotate(angle) {
            this.Context.rotate(angle)
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

            if (this.IsDash) {
                this.Context.setLineDash([this.Ratio * 2, 5 * this.Ratio])
            }
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
    //四边形
    class Quadrangle extends Shape {
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
            this.Close()
            this.Context.globalAlpha = 0.1
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

            //this.Save()
            ////move
            //this.Move(unitX * R2 + Cx, unitY * R2 + Cy)
            ////line
            //this.Line(unitX * R1 + Cx, unitY * R1 + Cy)
            ////arc
            //this.Arc(Cx, Cy, R1, StartAngle, EndAngle, !Anticlockwise)
            ////line
            //this.Line(Math.cos(EndAngle) * R2 + Cx, Math.sin(EndAngle) * R2 + Cy)
            ////arc
            //R2 !== 0 && this.Arc(Cx, Cy, R2, EndAngle, StartAngle, Anticlockwise)
            ////close
            //this.Close()
            //this.Restore()


            // 初始保存
            this.Save()
            // 位移到目标点
            this.Translate(Cx, Cy)
            this.BeginPath()
            // 画出圆弧
            this.Arc(0, 0, R1, StartAngle, EndAngle, !Anticlockwise)
            // 再次保存以备旋转
            this.Save()
            // 旋转至起始角度
            this.Rotate(EndAngle)
            // 移动到终点，准备连接终点与圆心
            this.Move(R1, 0)
            //连接到圆心
            this.Line(R2, 0)
            // 还原
            this.Restore()
            R2 !== 0 && this.Arc(0, 0, R2, EndAngle, StartAngle, Anticlockwise)
            // 再次保存以备旋转
            this.Save()
            // 旋转至起点角度
            this.Rotate(StartAngle)
            // 从圆心连接到起点
            this.Line(R1, 0)
            this.Close()
            // 还原到最初保存的状态
            this.Restore()
        }

        ComputeLineRPiont() {
            const { Cx, Cy, R1, R2, StartAngle, EndAngle } = this
            this.LineRAngle = (EndAngle + StartAngle) / 2
            this.LineR = Math.round(this.R1 * 1.08)
            this.LineR = this.LineR - this.R1 > 15 ? this.R1 + 15 : this.LineR
            this.LineR = this.LineR - this.R1 < 8 ? this.R1 + 8 : this.LineR

            this.LineX = Math.round(Math.cos(this.LineRAngle) * this.LineR) + this.Cx
            this.LineY = Math.round(Math.sin(this.LineRAngle) * this.LineR) + this.Cy

            let x1 = 0, y1 = 0, x2 = 0, y2 = 0
            this.LinePointList = []
            let lineWidth = 80

            const h = (this.LineR - this.R1)

            if (this.LineY >= this.Cy && this.LineX >= this.Cx) {
                x1 = this.LineX + h
                y1 = Math.round(this.LineY + h) + 0.5
                y1 = y1 > this.Cy * 2 - 20 ? this.Cy * 2 - 20 : y1

                if (this.LineX === this.Cx) {
                    x1 = this.LineX + 15
                    y1 = y2 = this.LineY + 5
                }

                x2 = x1 + lineWidth
                x2 = x2 > this.Cx * 2 - 10 ? this.Cx * 2 - 20 : x2
                y2 = y1

                this.LinePointList.push({ X: this.LineX, Y: this.LineY })
                this.LinePointList.push({ X: x1, Y: y1 })
                this.LinePointList.push({ X: x2, Y: y2 })

                this.LineTextX1 = Math.round(x1 + (x2 - x1) / 2)
                this.LineTextY1 = y1 - 7

                this.LineTextX2 = x1
                this.LineTextY2 = y1 + 15
            }
            else if (this.LineY >= this.Cy && this.LineX <= this.Cx) {
                x1 = this.LineX - h
                y1 = Math.round(this.LineY + h) + 0.5
                y1 = y1 > this.Cy * 2 - 20 ? this.Cy * 2 - 20 : y1

                if (this.LineX === this.Cx) {
                    x1 = this.LineX
                    y1 = y2 = this.LineY - 5
                }

                x2 = x1 - lineWidth
                x2 = x2 < 20 ? 20 : x2
                y2 = y1

                this.LinePointList.push({ X: x2, Y: y2 })
                this.LinePointList.push({ X: x1, Y: y1 })
                this.LinePointList.push({ X: this.LineX, Y: this.LineY })

                this.LineTextX1 = Math.round(x2 + (x1 - x2) / 2)
                this.LineTextY1 = y2 - 7

                this.LineTextX2 = x2
                this.LineTextY2 = y2 + 15
            }
            else if (this.LineY <= this.Cy && this.LineX <= this.Cx) {
                x1 = this.LineX - h
                y1 = Math.round(this.LineY - h) + 0.5

                x2 = x1 - lineWidth
                x2 = x2 < 20 ? 20 : x2
                y2 = y1

                this.LinePointList.push({ X: x2, Y: y2 })
                this.LinePointList.push({ X: x1, Y: y1 })
                this.LinePointList.push({ X: this.LineX, Y: this.LineY })

                this.LineTextX1 = Math.round(x2 + (x1 - x2) / 2)
                this.LineTextY1 = y2 - 7

                this.LineTextX2 = x2
                this.LineTextY2 = y2 + 15
            }
            else if (this.LineY <= this.Cy && this.LineX >= this.Cx) {
                x1 = this.LineX + h
                y1 = Math.round(this.LineY - h) + 0.5

                x2 = x1 + lineWidth
                x2 = x2 > this.Cx * 2 - 10 ? this.Cx * 2 - 20 : x2
                y2 = y1

                this.LinePointList.push({ X: this.LineX, Y: this.LineY })
                this.LinePointList.push({ X: x1, Y: y1 })
                this.LinePointList.push({ X: x2, Y: y2 })

                this.LineTextX1 = Math.round(x1 + (x2 - x1) / 2)
                this.LineTextY1 = y1 - 7

                this.LineTextX2 = x1
                this.LineTextY2 = y1 + 15
            }
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

        Contain(e) {
            const { X, Y } = e.Point
            const { TextRect } = this

            if (X >= TextRect.X && X <= TextRect.X + TextRect.Width
                && Y >= TextRect.Y && Y <= TextRect.Y + TextRect.Height) { return true }

            return false
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

        GetChart() {
            switch (this.Type) {
                case GraphType.Line:
                    return new ChartLine(this, this.Options)
                case GraphType.Pie:
                    return new ChartPie(this, this.Options)
                default: return null
            }
        }

        EventAction(name, e) {
            this.Chart && this.Chart.EventAction(name, e)
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
            this.Ratio = window.devicePixelRatio || 1
            this.CanvasWidth = this.Width
            this.CanvasHeight = this.Height
            this.CanvasWidth *= this.Ratio
            this.CanvasHeight *= this.Ratio
            const html = `<canvas id="${this.Id}" width="${this.CanvasWidth}" height="${this.CanvasHeight}" style="width:${this.Width}px;height:${this.Height}px;"></canvas>`
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
    class GraphSlider {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.GraphChartList = []

            if (options) { for (let key in options) { this[key] = options[key] } }
        }

        Load() {
            if (!this.GraphOptions || this.GraphOptions.length < 1) return

            if (this.GraphOptions.length > 1) {
                this.FirstItem = { TagId: Common.CreateGuid(), Graph: Object.assign({}, this.GraphOptions[this.GraphOptions.length - 1]) }
                this.LastItem = { TagId: Common.CreateGuid(), Graph: Object.assign({}, this.GraphOptions[0]) }
            }

            this.Element = document.getElementById(this.TagId)
            if (!this.Element) return

            this.Element.className = "GraphSlide"
            this.Element.style.display = "none"
            this.Element.innerHTML = this.GetHtml()

            this.UlElement = document.getElementById(this.Id)

            this.LoadGraphChartList()

            this.EventLoad()

            this.Translate(-this.Width, 50)

            setTimeout(() => this.Element.style.display = "", 60)
        }

        GetHtml() {
            const html = []

            let width = this.Width * (this.GraphOptions.length + 2)

            html.push(`<ul id="${this.Id}" style="position:absolute;width:${width}px;">`)

            this.GraphOptions.length > 1 && html.push(this.GetItemHtml(this.FirstItem))

            this.GraphOptions.forEach(g => {
                g.TagId = Common.CreateGuid()
                html.push(this.GetItemHtml(g))
            })

            this.GraphOptions.length > 1 && html.push(this.GetItemHtml(this.LastItem))

            html.push("</ul>")

            return html.join("")
        }

        GetItemHtml(item) {
            return `<li id="${item.TagId}" style="width:${this.Width}px;height:${this.Height}px;"></li>`
        }

        GetGraphChart(tagId, graph) {
            return {
                GraphChart: new GraphChart({
                    TagId: tagId, Width: this.Width, Height: this.Height, EventNames: graph.EventNames
                }),
                Options: [graph]
            }
        }

        LoadGraphChartList() {
            this.GraphChartList = [];

            if (this.GraphOptions.length > 1) {
                this.GraphChartList.push(this.GetGraphChart(this.FirstItem.TagId, this.FirstItem.Graph))
            }

            this.GraphOptions.forEach(g => {
                this.GraphChartList.push(this.GetGraphChart(g.TagId, g))
            })

            if (this.GraphOptions.length > 1) {
                this.GraphChartList.push(this.GetGraphChart(this.LastItem.TagId, this.LastItem.Graph))
            }

            this.GraphChartList.forEach((g, i) => {
                g.Index = i + 1
                g.GraphChart.Draw(g.Options)
            })

            this.SelectGraphChart = this.GraphChartList[1]
            this.SelectGraphChart.Left = -this.Width
        }

        Translate(x, time) {
            time = time === undefined ? "0ms" : time + "ms"
            this.SetStyle(this.UlElement, "transform", `translate(${x}px,0px) translateZ(0)`)
            this.SetStyle(this.UlElement, "transitionTimingFunction", "cubic-bezier(0.1, 0.57, 0.1, 1)")
            this.SetStyle(this.UlElement, "transitionDuration", time)
        }

        SetStyle(ele, key, value) {
            if (ele && ele.style) {
                ele.style[key] = value
                let styleName = key.charAt(0).toUpperCase() + key.substr(1)
                let prefixs = ["webkit", "Moz", "ms", "O"]
                for (let i = 0; i < prefixs.length; i++) {
                    key = prefixs[i] + styleName
                    if (key in ele.style) {
                        ele.style[key] = value
                    }
                }
            }
        }

        SetSelectIndex(selectGraphChart, time) {
            if (selectGraphChart) this.SelectGraphChart = selectGraphChart

            if (this.SelectGraphChart) {
                this.SetSelectItem(this.SelectGraphChart, time);
            }
        }

        SetSelectItem(data, time) {
            let beforeList = this.GraphChartList.filter(f => f.Index < data.Index)
            let l = beforeList.length
            let left = 0 - l * this.Width
            data.Left = left
            this.Translate(left, time)
        }

        EventLoad() {
            const start = (e) => this.Start(e)
            const end = (e) => this.End(e)

            Common.BindEvent(this.UlElement, "touchstart", start)
            Common.BindEvent(window, "touchend", end)
            Common.BindEvent(window, "touchcancel", end)
        }

        Start(e) {
            this.IsTouchStart = true
            const point = e.touches ? e.touches[0] : e
            this.StartX = point.pageX
            this.StartY = point.pageY
            this.BindMove()
        }

        Move(e) {
            if (this.IsTouchStart) {
                e.preventDefault && e.preventDefault()
                this.IsTouchMove = true
                let point = e.touches ? e.touches[0] : e
                let dx = point.pageX - this.StartX
                let dy = point.pageY - this.StartY
                if (Math.abs(dx) > Math.abs(dy)) {
                    let x = this.SelectGraphChart.Left + dx
                    this.Translate(x)
                }
            }
        }

        BindMove(blRemove) {
            const move = (e) => this.Move(e)

            const ele = this.UlElement
            if (blRemove) {
                Common.RemoveEvent(ele, "touchmove", move)
            }
            else {
                Common.BindEvent(ele, "touchmove", move)
            }
        }

        End(e) {
            if (this.IsTouchMove && this.IsTouchStart) {
                let point = e.changedTouches ? e.changedTouches[0] : e
                let x = point.pageX - this.StartX
                if (x > 50) {
                    this.SetLast(200)
                }
                else if (x <= -50) {
                    this.SetNext(200)
                }
                else {
                    this.Translate(this.SelectGraphChart.Left, 50)
                }
            }
            if (this.IsTouchStart) this.BindMove(true)
            this.IsTouchStart = false
            this.IsTouchMove = false
        }

        SetLast(time) {
            let selectGraphChart = null, item = null

            for (let i = this.GraphChartList.length - 2; i >= 1; i--) {
                item = this.GraphChartList[i]
                if (this.SelectGraphChart && item.Index < this.SelectGraphChart.Index) {
                    selectGraphChart = item
                    break
                }
            }

            let blLast = false

            if (selectGraphChart === null) {
                selectGraphChart = this.GraphChartList[this.GraphChartList.length - 2]
                time = 0
                blLast = true
                this.Translate(0, 200)
            }

            if (selectGraphChart !== null) {
                if (blLast) {
                    window.setTimeout(() => {
                        this.SetSelectIndex(selectGraphChart, time)
                    }, 200)
                }
                else {
                    this.SetSelectIndex(selectGraphChart, time)
                }
            }
        }

        SetNext(time) {
            let selectGraphChart = null, item = null

            for (let i = 1; i < this.GraphChartList.length - 1; i++) {
                item = this.GraphChartList[i]
                if (this.SelectGraphChart && item.Index > this.SelectGraphChart.Index) {
                    selectGraphChart = item
                    break
                }
            }

            let blFirst = false

            if (selectGraphChart === null) {
                selectGraphChart = this.GraphChartList[1]
                time = 0
                blFirst = true

                let l = this.GraphChartList.length - 1
                let left = 0 - l * this.Width
                this.Translate(left, 200)
            }

            if (selectGraphChart !== null) {
                if (blFirst) {
                    window.setTimeout(() => {
                        this.SetSelectIndex(selectGraphChart, time)
                    }, 200)
                }
                else {
                    this.SetSelectIndex(selectGraphChart, time)
                }
            }
        }

    }
    window.GraphChart = GraphChart; window.GraphSlider = GraphSlider;
})()
