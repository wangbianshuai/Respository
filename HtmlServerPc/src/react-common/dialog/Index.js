import React from "react";
import BaseIndex2 from "../BaseIndex2";

export default class Index extends BaseIndex2 {
    constructor(props) {
        super(props);
    }

    static get defaultProps() {
        return {
            IsVisible: false
        }
    }

    componentDidMount() {
        Index.ZIndex += 1;
    }

    render() {
        const { IsVisible } = this.props;
        if (!IsVisible) return null;

        const style = {};
        style.zIndex = Index.ZIndex;

        return (
            <div className="mui-dialog" style={style}>
                <div className="mui-dialog-inner clearfix">
                    {this.props.children}
                </div><span class="after"></span>
            </div>
        )
    }
}

Index.ZIndex = 100000;