import React from "react";
import { usePage } from "UseHooks";
import { Common, PageCommon } from "UtilsCommon";
import Components from "Components";
import styles from "../styles/login.css"

const _Name = "login";

export default (props) => {
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
    Common.removeStorage("token");
    this.setActionState("AdminUserService", "login");
    this.loginSuccess = loginSuccess;
}

function loginSuccess({ data }) {
    Common.setStorage("loginUserInfo", JSON.stringify(data));
    Common.setStorage("loginUserId", data.AdminUserId);
    Common.setStorage("appAccountId", data.AppAccountId);
    const url = "/personCenter/appAccountInfo";
    PageCommon.toPage(url);
}

function mapStateToProps(state) {
    return {
        login: state.AdminUserService.login
    }
}
