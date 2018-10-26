import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index"

class Index extends BaseIndex {
    constructor(props) {
        super(props);

       
    }

    GetModel() {
        return {
            title: "【新新贷官网】专业透明的P2P网络借贷平台，P2P网贷，网上贷款借款、投融资信息中介平台",
            keywords: "新新贷，P2P网贷，P2P理财，投资理财，网上理财，新元宝，月月派，新手专享，投融资，贷款，企业贷款，无抵押小额贷款，借款",
            description: "新新贷是中国专业的互联网金融P2P网络借贷信息中介平台，为出借人和借款人提供省心的互联网金融信息服务。资金银行存管、严格的风控体系、信息披露透明等多重安全保障措施。"
        }
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
                <input type="button" value="测试" onClick={this.TestClick.bind(this)} />
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