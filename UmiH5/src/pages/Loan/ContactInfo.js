import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig} from "UtilsCommon";
import Components from "Components";
const PropertyItem = Components.PropertyItem;

class ContactInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_ContactInfo";

        this.InitEventAction();
    }

    componentDidMount() {
        this.PageConfig.EventActions.forEach(a => {

        })
    }


    render() {
        return <PropertyItem Property={this.PageConfig} EventActions={this.EventActions}/>
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {

    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_ContactInfo", ContactInfo)));
