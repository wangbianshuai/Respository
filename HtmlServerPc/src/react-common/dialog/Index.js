import React, { Component } from "react";

var DialogZIndex = 100000;

export default WrapComponent => class Index extends Component {
    constructor(props) {
        super(props);

        this.state = { IsVisible: false }
    }

    Init() {
        DialogZIndex += 1;
        this.ZIndex = DialogZIndex;

        if (this.props.CloseMills > 0) setTimeout(() => {
            this.Close();
            if (this.props.Callback) this.props.Callback();
        }, this.props.CloseMills);
    }

    Close() {
        this.setState({ IsVisible: false });
    }

    Show() {
        this.setState({ IsVisible: true });
    }

    GetProps() {
        const { Show, Close } = this
        return { Show, Close };
    }

    render() {
        const { IsVisible } = this.state;
        if (!IsVisible) return null;

        const style = {};
        style.zIndex = this.ZIndex;

        return (
            <div className="mui-dialog" style={style}>
                <div className="mui-dialog-inner clearfix">
                    <WrapComponent {...this.props} {...this.GetProps()} />
                </div><span className="after"></span>
            </div>
        )
    }
}