import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";

class Index extends BaseIndex {
    constructor(props) {
        super(props);
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "User", "GetUserInfo");
    }

    componentDidMount() {
        this.props.UserInfo === undefined && this.Dispatch("User", "GetUserInfo");
    }

    PropsChanged(nextProps) {
        //用户信息
        this.ReceiveUserInfo(nextProps);
    }

    ReceiveUserInfo(nextProps) {
        if (this.JudgeChanged(nextProps, "UserInfo") && nextProps.UserInfo.UserId) {
        }
    }

    TestClick() {
        alert("123")
    }

    render() {
        const userInfo = this.GetPropsValue("UserInfo", "UserId", {});

        return (
            <div className="VideoTopic">
                <div>姓名：{userInfo.name}</div>
                <div>性别：{userInfo.gender}</div>
                <div>年龄：{userInfo.age}</div>
                <input type="button" value="测试" onClick={this.TestClick.bind(this)} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
        UserInfo: state.User.UserInfo
    };

    console.log(props)
    return props;
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Index)