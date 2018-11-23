import React from "react";
import BaseIndex2 from "../BaseIndex2";
import Dialog from "../dialog/Index";
import { Common } from "UtilsCommon";

export default class Index extends BaseIndex2 {
    constructor(props) {
        super(props);

        this.state = { IsVisible: true };
    }

    static get defaultProps() {
        return {
            Title: "提示"
        }
    }

    Ok() {
        return () => this.setState({ IsVisible: false });
    }

    render() {
        const { Title, Content } = this.props;
        const { IsVisible } = this.state;
        if (!IsVisible) return null;

        const style = {};
        style.zIndex = Index.ZIndex;

        return (
            <Dialog IsVisible={IsVisible}>
                <div class="mui-dialog-float">
                    <span class="mui-float-title">{Title}</span>
                    <div class="mui-float-content">{Content}</div>
                    <a class="mui-float-confirm c_confirm" onClick={this.Ok()}>确定</a>
                </div>
            </Dialog>
        )
    }
}