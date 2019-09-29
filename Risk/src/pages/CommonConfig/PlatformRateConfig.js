import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class PlatformRateConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_PlatformRateConfig";
        this.MenuKey = "PlatformRateConfig";

        this.InitEventAction();
    }

    ToEditPage(props, action) {
        if (this.SelectRateType === 2) this.ToPage("/CommonConfig/PlatformServiceRateEdit");
        else if (this.SelectRateType === 3) this.ToPage("/CommonConfig/PlatformFineRateEdit");
        else this.ToPage("/CommonConfig/PlatformManageRateEdit")
    }

    componentDidMount() {
        this.RateType = this.GetControl("RateType");
        this.RateType.ValueChange = this.RateTypeValueChange.bind(this);

        this.DataGridView = this.GetComponent("DataGridView1");
    }

    RateTypeValueChange(value) {
        value = Common.GetIntValue(value);
        this.SelectRateType = value;
        const hideColNames = value === 1 ? ["ServiceRateName", "FineRateName"] : value === 2 ? ["ManageRateName", "FineRateName"] : ["ServiceRateName", "ManageRateName", "CollectionTypeName", "CollectionMethodName"];
        this.DataGridView.SetColumnsVisible(hideColNames)
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.PlatformRateService.DataList,
        DeleteEntityData: state.PlatformRateService.DeleteEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CommonConfig_PlatformRateConfig", PlatformRateConfig)));