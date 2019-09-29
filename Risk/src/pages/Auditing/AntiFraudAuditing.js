import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class AntiFraudAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_AntiFraudAuditing";

        this.InitEventAction();
    }

    ReceiveSetAntiFraudRequest(data) {
        data.requestId = this.PageData.OrderCode;

        const { requestId, name, idNumber, mobile, orgCode, orgName } = data;

        this.AsyncRequest.GetBaiqishi = { requestId, name, idNumber, mobile };
        this.AsyncRequest.GetHuifa = { requestId, name, idNumber };
        this.AsyncRequest.GetBairongApply = { requestId, name, idNumber, mobile };
        this.AsyncRequest.GetBairongSpecial = { requestId, name, idNumber, mobile };
        this.AsyncRequest.GetTongdun = { requestId, name, idNumber, mobile };
        this.AsyncRequest.GetPengyuan = { requestId, name, idNumber, mobile };
        this.AsyncRequest.GetZhonghujin = { requestId, name, idNumber };
        this.AsyncRequest.GetCompanyHuifa = { requestId, orgCode, orgName };
        this.AsyncRequest.GetCompanyPengyuan = { requestId, orgCode, orgName };

        for (var key in this.AsyncRequestFunction) {
            this.AsyncRequestFunction[key](this.AsyncRequest[key]);
            delete this.AsyncRequestFunction[key];
        }
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetBaiqishi: state.AntiFraudService.GetBaiqishi,
        GetHuifa: state.AntiFraudService.GetHuifa,
        GetBairongApply: state.AntiFraudService.GetBairongApply,
        GetBairongSpecial: state.AntiFraudService.GetBairongSpecial,
        GetTongdun: state.AntiFraudService.GetTongdun,
        GetPengyuan: state.AntiFraudService.GetPengyuan,
        GetZhonghujin: state.AntiFraudService.GetZhonghujin,
        GetCompanyHuifa: state.AntiFraudService.GetCompanyHuifa,
        GetCompanyPengyuan: state.AntiFraudService.GetCompanyPengyuan,
        GetFraudVerify: state.AntiFraudService.GetFraudVerify
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_AntiFraudAuditing", AntiFraudAuditing)));