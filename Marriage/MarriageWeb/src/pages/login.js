import React from "react";
import { usePage } from "UseHooks";
import { Common, PageCommon } from "UtilsCommon";
import Components from "Components";
import styles from "../styles/login.css"

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
    Common.removeStorage("token");
    this.setActionState("AdminUserService", "login");
}

function loginSuccess({ data }) {
    Common.setStorage("loginUserInfo", JSON.stringify(data));
    Common.setStorage("loginUserId", data.AdminUserId);
    const url = "/personCenter/appAccountInfo";
    PageCommon.toPage(url);
}

function mapStateToProps(state) {
    return {
        loading: state.AdminUserService.login_loading,
        login: state.AdminUserService.login
    }
}
