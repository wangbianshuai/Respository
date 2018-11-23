import React from "react";
import BaseIndex2 from "../BaseIndex2";
import Dialog from "../dialog/Index";

export default class Index extends BaseIndex2 {
    constructor(props) {
        super(props);

        this.state = { IsVisible: true };
    }

    static get defaultProps() {
        return {
            Title: "提示",
            CloseMills: 0,
            IsOk: true
        }
    }

    componentDidMount() {
        if (this.props.CloseMills > 0) setTimeout(() => {
            this.Close();
            if (this.props.Callback) this.props.Callback();
        }, this.props.CloseMills);
    }

    Close() {
        this.setState({ IsVisible: false });
    }

    render() {
        const { Title, Content, IsOk } = this.props;
        const { IsVisible } = this.state;
        if (!IsVisible) return null;

        return (
            <Dialog IsVisible={IsVisible}>
                <div className="mui-dialog-float">
                    <span className="mui-float-title">{Title}</span>
                    <div className="mui-float-content">{Content}</div>
                    {IsOk && <a className="mui-float-confirm c_confirm" onClick={this.Close.bind(this)}>确定</a>}
                </div>
            </Dialog>
        )
    }
}