import React from "react";
import { usePage } from "UseHooks";
import { Common } from "UtilsCommon";
import Components from "Components";
import { EnvConfig } from "Configs";
import styles from "../styles/login.scss"

const isH5 = Common.isH5();

export default (props) => {
    const pageAxis = usePage('login', props, mapStateToProps, init);

    if (pageAxis === null) return null;

    let style = { minHeight: "100%", width: "100%" };
    if (!isH5) style = { minHeight: "100%", width: '480px', margin: "0 auto" }

    return (
        <div className={styles.divContainer} style={style}>
            <div className={styles.divLogin}>
                <Components.PropertyItem property={pageAxis.pageConfig} pageId={pageAxis.id} />
            </div>
        </div>
    )
}

function init() {
    this.componentDidMount = componentDidMount;
    this.loginSuccess = loginSuccess.bind(this);
}

function componentDidMount() {
    Common.removeStorage(EnvConfig.tokenKey);
    this.setActionState("AdminUserService", "login");
}

function loginSuccess({ data }) {
    Common.setStorage("loginUserInfo", JSON.stringify(data));
    Common.setStorage("loginUserId", data.UserId);
    const url = "/accountBillList.html";
    this.toPage(url);
}

function mapStateToProps(state) {
    return {
        loading: state.AdminUserService.login_loading,
        login: state.AdminUserService.login
    }
}
