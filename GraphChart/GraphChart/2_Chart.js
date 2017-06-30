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