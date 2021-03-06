﻿class GraphChart {
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