import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index"

class Index extends BaseIndex {
    constructor(props) {
        super(props)

    }

    componentDidMount() {

    }

    PropsChanged(nextProps) {
    }

    TestClick() {
        alert("123")
    }

    render() {
        return (
            <div className="VideoTopic">
                404:页面不存在！
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
    };

    //console.log(props);

    return props;
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Index)