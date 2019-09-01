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
	
		document.title = "联系人信息";
    }

    componentDidMount() {
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('联系人信息'));
    }

    render() {
        return (
        	<div>
				<div className="WhiteSpace2"></div>
				<PropertyItem Property={this.PageConfig} EventActions={this.EventActions}/>
			</div>
        	
		)
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
		LoanContactInfo:state.UserCenterService.LoanContactInfo,
		SaveLoanContactInfo:state.UserCenterService.SaveLoanContactInfo,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_ContactInfo", ContactInfo)));
