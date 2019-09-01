import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig, Common} from "UtilsCommon";
import Components from "Components";
const PropertyItem = Components.PropertyItem;

class BasicInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_BasicInfo";

        this.InitEventAction();
	
		document.title = "借款人基本信息";
    }

    componentDidMount() {
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('借款人基本信息'));
		
        this.InitLoad()
    }
    
	SetNavigatinBarTitle(title){
		this.Bridge.Js2Native.SetNavigatinBarTitle(title);
	}
	
    InitLoad() {
        this.PageConfig.Properties.forEach(p => {
            if (p.Name === "hdOwnerShip") {
                p.ValueChange = this.homeAddrOwnerShipChange.bind(this);
                p.IsLoadValue = true;
            }
            else if (p.Name === "hdEffectiveDate") this.homeAddrTimeLimitStartProperty = p;
            else if (p.Name === "hdExpiredDate") this.homeAddrTimeLimitEndProperty = p;
            if (p.Name === "maritalstatus") {
                p.ValueChange = this.MaritalStatusChange.bind(this);
                p.IsLoadValue = true;
            }
            else if (p.Name === "marriedYear") this.MaritalYearProperty = p;
        });
    }

    
    MaritalStatusChange(value) {
        if (!this.MaritalYearProperty) return;
        const isVisible = Common.IsEquals(value, 2);
        this.MaritalYearProperty.SetVisible(isVisible);
        if (!isVisible) this.MaritalYearProperty.SetValue("");
    }

    homeAddrOwnerShipChange(value) {
        if (!this.homeAddrTimeLimitStartProperty) return;
        const isVisible = Common.IsEquals(value, '01');
        this.homeAddrTimeLimitStartProperty.SetVisible(isVisible);
        this.homeAddrTimeLimitEndProperty.SetVisible(isVisible);
        if (!isVisible) {
            this.homeAddrTimeLimitStartProperty.SetValue("");
            this.homeAddrTimeLimitEndProperty.SetValue("");
        }
    }

    render() {
        return <PropertyItem Property={this.PageConfig} EventActions={this.EventActions}/>
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        // SaveUserInfo: state.UserCenterService.SaveUserInfo,
        // UserInfo: state.UserCenterService.UserInfo,
		LoanBasicInfo:state.UserCenterService.LoanBasicInfo,
		SaveLoanBasicInfo:state.UserCenterService.SaveLoanBasicInfo,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_BasicInfo", BasicInfo)));
