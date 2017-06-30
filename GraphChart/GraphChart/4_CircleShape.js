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