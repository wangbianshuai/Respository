import React, { Component } from "react";
import Dialog from "../dialog/Index";

class Index extends Component {
    constructor(props) {
        super(props);

        this.Init();
    }

    static get defaultProps() {
        return {
            Title: "提示",
            CloseMills: 0,
            IsOk: true
        }
    }

    render() {
        const { Title, Content, IsOk, Close } = this.props;

        return (
            <div className="mui-dialog-float">
                <span className="mui-float-title">{Title}</span>
                <div className="mui-float-content">{Content}</div>
                {IsOk && <a className="mui-float-confirm c_confirm" onClick={Close.bind(this)}>确定</a>}
            </div>
        )
    }
}

export default Dialog(Index);