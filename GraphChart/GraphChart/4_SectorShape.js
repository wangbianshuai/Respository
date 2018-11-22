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