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