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