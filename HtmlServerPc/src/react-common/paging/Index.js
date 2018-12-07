import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { PageIndex: props.PageIndex }
    }

    static get defaultProps() {
        return {
            PageRecord: 0,
            PageIndex: 1,
            PageSize: 10,
            PageCount: 0,
            Change: Function()
        }
    }

    ComputePageCount(pageRecord, pageSize) {
        if (pageRecord % pageSize === 0) return pageRecord / pageSize;
        else return Common.GetIntValue(pageRecord / pageSize) + 1;
    }

    componentWillMount() {
        this.PageCount = this.props.PageCount > 0 ? this.props.PageCount : this.ComputePageCount(this.props.PageRecord, this.props.PageSize);
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.PageIndex !== this.state.PageIndex) this.setState({ PageIndex: nextProp.PageIndex });
        else if (nextProp.PageCount !== this.props.PageCount) this.PageCount = nextProp.PageCount;
        if (nextProp.PageRecord !== this.props.PageRecord || nextProp.PageSize !== this.props.PageSize) this.PageCount = this.ComputePageCount(nextProp.PageRecord, nextProp.PageSize);
    }

    ChangeIndex(PageIndex) {
        if (PageIndex === this.state.PageIndex) return;

        const PageCount = this.PageCount;
        const { PageRecord, PageSize } = this.props;

        if (PageIndex > PageCount) PageIndex = PageCount;
        else if (PageIndex < 1) PageIndex = 1;

        if (PageIndex === this.state.PageIndex) return;

        this.setState({ PageIndex: PageIndex });
        this.props.Change({ PageRecord, PageCount, PageIndex, PageSize })
    }

    GetIndexList(pageIndex) {
        const list = [], pageCount = this.PageCount;
        const loopSize = pageCount > 5 ? 5 : pageCount;
        let startIndex = 1, half = Common.GetIntValue((loopSize + 1) / 2);

        if (pageCount <= 5 || pageIndex < half) startIndex = 1;
        else if (pageIndex + half > pageCount) startIndex = pageCount - 5 + 1;
        else startIndex = pageIndex - half + 1;

        for (let i = 0; i < loopSize; i++) list.push(startIndex + i);
        return list;
    }

    render() {
        const { PageIndex } = this.state;
        const IndexList = this.GetIndexList(PageIndex);

        return (
            <ul className="mui-pagination-ul">
                <li className='total-page'>总页数<span>{this.PageCount}</span>页</li>
                <li className="j_firstPage" onClick={this.ChangeIndex.bind(this, 1)}><a>首页</a></li>
                <li className="j_prvPage" onClick={this.ChangeIndex.bind(this, PageIndex - 1)}><a>«</a></li>

                {IndexList.map(m => <li key={Common.CreateGuid()} onClick={this.ChangeIndex.bind(this, m)} className={m === PageIndex ? "active" : ""}><a>{m}</a></li>)}

                <li className="j_nextPage" onClick={this.ChangeIndex.bind(this, PageIndex + 1)}><a>»</a></li>
                <li className='last j_lastPage' onClick={this.ChangeIndex.bind(this, this.PageCount)}><a>尾页</a></li>
            </ul >
        )
    }
}