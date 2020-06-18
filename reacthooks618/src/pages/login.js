import React, { useEffect, useState } from "react";
import { useProcessData, useConnectAction, useGetPageConfig, usePageAxis } from "UseHooks";
import { Common } from "UtilsCommon";
import Components from "Components";
import styles from "../styles/Login.css"

const _Name = "login";

const Login = (props) => {
    //第一步 使用链接数据行为
    const [invoke, actionTypes, actionData] = useConnectAction(_Name);

    //第二步 使用处理数据，对接useDvaData
    const [dispatch, dispatchAction, setActionState, getStateValue] = useProcessData(mapStateToProps, props);

    //第三步 使用获取页面配置
    const pageConfig = useGetPageConfig(_Name, dispatchAction);

    //第四步 使用页线，作用贯穿整个流程
    const pageAxis = usePageAxis({
        name: _Name, pageConfig, invoke, actionTypes, dispatch,
        dispatchAction, setActionState, getStateValue, loginSuccess, init
    });

    //第五步 接收行为数据
    useEffect(() => {
        pageAxis && pageAxis.receiveActionData(actionData)
    }, [pageAxis, actionData]);

    if (pageAxis === null) return null;

    return (
        <div className={styles.divContainer}>
            <div className={styles.divLogin}>
                <Components.PropertyItem property={pageConfig} pageId={pageAxis.id} />
            </div>
        </div>
    )
}

function init() {
    Common.removeStorage("Token");
    this.setActionState("AdminUserService", "Login");
}

function loginSuccess({ data, props }) {
    const { pageAxis } = props;

    Common.setStorage("LoginUserInfo", JSON.stringify(data));
    Common.setStorage("LoginUserId", data.AdminUserId);
    Common.setStorage("AppAccountId", data.AppAccountId);
    const url = "/personCenter/appAccountInfo";
    pageAxis.toPage(url);
}

function mapStateToProps(state) {
    return {
        login: state.AdminUserService.login
    }
}

export default Login;
