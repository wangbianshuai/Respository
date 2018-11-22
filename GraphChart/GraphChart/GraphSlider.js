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