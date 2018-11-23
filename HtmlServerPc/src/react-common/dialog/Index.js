import React from "react";
import BaseIndex2 from "../BaseIndex2";

export default class Index extends BaseIndex2 {
    constructor(props) {
        super(props);

        Index.ZIndex += 1;
        this.ZIndex = Index.ZIndex;
    }

    static get defaultProps() {
        return {
            IsVisible: false
        }
    }

    render() {
        const { IsVisible } = this.props;
        if (!IsVisible) return null;

        const style = {};
        style.zIndex = this.ZIndex;

        return (
            <div className="mui-dialog" style={style}>
                <div className="mui-dialog-inner clearfix">
                    {this.props.children}
                </div><span className="after"></span>
            </div>
        )
    }
}

Index.ZIndex = 100000;