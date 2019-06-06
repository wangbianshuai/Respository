import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class UserEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_UserEdit";

        this.InitEventAction();
    }

    componentDidMount() {
        this.EditView = this.GetView("UserEdit2");
        this.EditView.ExpandSetEntityData = this.SetEntityData.bind(this)
    }

    SetEntityData(data) {
        const { SelectData } = this.EditView;
        if (SelectData) {
            data.Email = SelectData.Email;
            data.Phone = SelectData.Phone;
        }
        return data;
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        EntityData: state.UserService.EntityData,
        SaveEntityData: state.UserService.SaveEntityData,
        UserList: state.ApiService.UserList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("RightManage_UserEdit", UserEdit)));