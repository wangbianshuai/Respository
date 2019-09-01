import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class ApplicationList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "ConfigManage_ApplicationList";
        this.MenuKey = "ApplicationList";

        this.InitEventAction();
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.ApplicationService.SearchQuery,
        DeleteEntityData: state.ApplicationService.DeleteEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("ConfigManage_ApplicationList", ApplicationList)));