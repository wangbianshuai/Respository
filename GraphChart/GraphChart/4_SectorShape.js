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