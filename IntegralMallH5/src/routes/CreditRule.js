import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import Index from "./Index"
import Header from "../components/Header";
import CreditRuleCom from "../components/CreditRuleCom";

class CreditRule extends Index {
    constructor(props) {
        super(props)

        this.Title = "积分规则";
        this.EntityName = "CreditRule";

        this.state = {
            Title: this.Title,
        };
    }

    componentDidMount() {
        if (!this.JudgeLogin()) return;
    }

    render() {

        return (
            <div>
                <Header Page={this} Title={"积分规则"} IsRight={false} />
                <CreditRuleCom />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
        Loading: state.Product.Loading,
        UserInfo: state.Account.UserInfo
        //Product: state.Product.Product
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(CreditRule)