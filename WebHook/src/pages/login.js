import React from "react";
import { BaseIndex, RootPage } from "ReactCommon";
import {Common } from "UtilsCommon";
import Components from "Components";
import styles from "../styles/Login.css"

class Login extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Login";

        this.InitEventAction();

        Common.RemoveCookie("Token");
        this.SetActionState("ApiService", "Login");
    }

    LoginSuccess({ data, props, action }) {
        Common.SetStorage("LoginUserInfo", JSON.stringify(data))
        Common.SetStorage("LoginUserId", data.UserId)
        this.ToPage("/PurchaseSaleManage/SaleInput");
    }

    render() {
        return (
            <div className={styles.DivContainer}>
                <div className={styles.DivLogin}>
                    <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        Login: state.ApiService.Login
    }
}

export default RootPage(Login, mapStateToProps);