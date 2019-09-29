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
        this.EditView.ExpandSetEntityData = this.SetEntityData.bind(this);
        this.SelectUser = this.GetViewProperty(this.EditView, "SelectUser");
    }

    SetSelectUserDataList({ dataList }) {
        dataList.forEach(d => d.UserName = d.realname + "(" + d.usercode + ")");
        return dataList;
    }

    SetEntityData(data) {
        if (data === false) return false;
        const selectData = this.SelectUser.GetSelectData();
        if (selectData !== null) {
            return {
                employeeId: selectData.usercode,
                name: selectData.realname,
                department: selectData.depStr,
                job: selectData.position,
                email: selectData.email,
                phone: selectData.mobile
            }
        }
        else {
            this.Alert("请通过检索员工姓名或编号选择相应的员工！");
            return false;
        }
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SaveEntityData: state.UserService.SaveEntityData,
        EmployeeList: state.EmployeeService.EmployeeList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("RightManage_UserEdit", UserEdit)));