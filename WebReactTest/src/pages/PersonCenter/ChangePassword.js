import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig} from "UtilsCommon";
import Components from "Components";

class ChangePassword extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "PersonCenter_ChangePassword";

        this.InitEventAction();
    }

    render() {
        return (
            <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        ChangePassword: state.ApiService.ChangePassword
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("PersonCenter_ChangePassword", ChangePassword)));