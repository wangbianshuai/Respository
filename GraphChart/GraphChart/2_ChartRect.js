class ChartRect extends Chart {
    constructor(graph, options) {
        super(graph, options)
    }

    GetShapeList() {
        const { X, Y, Width, Height, R } = this
        return [new RectShape(this.Context, options.Data, { X, Y, Width, Height, R })]
    }
}