import React from "react";
import { usePage } from "UseHooks";
import { Common, PageCommon } from "UtilsCommon";
import Components from "Components";
import styles from "../styles/Login.css"

const _Name = "login";

const Login = (props) => {
    const pageAxis = usePage(_Name, props, mapStateToProps, init);

    if (pageAxis === null) return null;

    return (
        <div className={styles.divContainer}>
            <div className={styles.divLogin}>
                <Components.PropertyItem property={pageAxis.pageConfig} pageId={pageAxis.id} />
            </div>
        </div>
    )
}

function init() {
    Common.removeStorage("Token");
    this.setActionState("AdminUserService", "Login");
    this.loginSuccess = loginSuccess;
}

function loginSuccess({ data }) {
    Common.setStorage("LoginUserInfo", JSON.stringify(data));
    Common.setStorage("LoginUserId", data.AdminUserId);
    Common.setStorage("AppAccountId", data.AppAccountId);
    const url = "/personCenter/appAccountInfo";
    PageCommon.toPage(url);
}

function mapStateToProps(state) {
    return {
        login: state.AdminUserService.login
    }
}

export default Login;
