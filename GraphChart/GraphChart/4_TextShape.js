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
            && Y >= TextRect.Y && Y <= TextRect.Y + TextRect.Height)
        { return true }

        return false
    }
}