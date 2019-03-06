import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class NewsMedia extends Component {
    constructor(props) {
        super(props);

        this.state = { SelectTabIndex: 0 }
    }

    SetSelectTabIndex(index) {
        if (index != this.state.SelectTabIndex) this.setState({ SelectTabIndex: index });
    }

    render() {
        const { SelectTabIndex } = this.state;
        const { News, Media } = this.props;

        return (
            <div className="news">
                <div className="title" id="J_titleNews">
                    <span className={"menu" + (SelectTabIndex === 0 ? " active" : "")} onClick={this.SetSelectTabIndex.bind(this, 0)}>新闻动态</span>
                    <span className={"menu" + (SelectTabIndex === 1 ? " active" : "")} onClick={this.SetSelectTabIndex.bind(this, 1)}>媒体报道</span>
                    <a href="/html/help/newsreport.html" className="more">更多</a>
                </div>
                <ul className={"news-list" + (SelectTabIndex === 0 ? "" : " hide")}>
                    {News && News.map && News.map(m => <li key={Common.CreateGuid()}><a href={m.textHref}>{m.text}</a></li>)}
                </ul>
                <ul className={"media-list" + (SelectTabIndex === 1 ? "" : " hide")}>
                    {Media && Media.map && Media.map(m => <li key={Common.CreateGuid()}><a href={m.textHref}>{m.text}</a></li>)}
                </ul>
            </div>
        )
    }
}