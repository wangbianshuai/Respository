import React from "react";
import { usePage } from "UseHooks";
import { Common, PageCommon } from "UtilsCommon";
import Components from "Components";
import { EnvConfig } from "Configs";
import styles from "../styles/login.scss"

export default (props) => {
    const pageAxis = usePage('login', props, mapStateToProps, init);

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
    this.componentDidMount = componentDidMount;
    this.loginSuccess = loginSuccess;
}

function componentDidMount() {
    Common.removeStorage(EnvConfig.tokenKey);
    this.setActionState("AdminUserService", "login");
}

function loginSuccess({ data }) {
    Common.setStorage("loginUserInfo", JSON.stringify(data));
    Common.setStorage("loginUserId", data.UserId);
    const url = "/accountBillList.html";
    PageCommon.toPage(url);
}

function mapStateToProps(state) {
    return {
        loading: state.AdminUserService.login_loading,
        login: state.AdminUserService.login
    }
}
