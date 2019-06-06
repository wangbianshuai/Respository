import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig} from "UtilsCommon";
import Components from "Components";
const PropertyItem = Components.PropertyItem;

class BasicInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_BasicInfo";

        this.InitEventAction();
    }

    componentDidMount() {
        this.PageConfig.EventActions.forEach(a => {
            // if (a.Name === "AddHouse") a.ExpandAdd = this.ExpandDataListViewAdd.bind(this);
            // else if (a.Name === "DeleteHouse") a.ExpandRemove = this.ExpandDataListViewRemove.bind(this);
        })
    }


    render() {
        return <PropertyItem Property={this.PageConfig} EventActions={this.EventActions}/>
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SaveCompanyInfo: state.UserCenterService.SaveCompanyInfo,
        CompanyInfo: state.UserCenterService.CompanyInfo,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_BasicInfo", BasicInfo)));
