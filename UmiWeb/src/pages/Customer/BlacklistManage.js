import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class BlacklistManage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_BlacklistManage";

        this.InitEventAction();
    }

    componentDidMount() {
        const userType = this.GetControl("UserType");
        userType.ValueChange = this.UserTypeValueChange.bind(this);

        this.DataGridView = this.GetComponent("DataGridView1");
    }

    UserTypeValueChange(value) {
        const hideColNames = Common.IsEquals(value, 1) ? ["CompanyName", "CompanyIdNumber"] : ["Name", "IdNumber"];
        this.DataGridView.SetColumnsVisible(hideColNames)
    }

    render() {
        return <Components.View Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        DataList: state.BlacklistService.DataList,
        DeleteEntityData: state.BlacklistService.DeleteEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Customer_BlacklistManage", BlacklistManage)));