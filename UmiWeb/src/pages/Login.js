import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";
import styles from "../styles/Login.css"

class Login extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Login";

        this.InitEventAction();

        Common.SetStorage("Token", "");
    }

    LoginSuccess({ data, props, action }) {
        Common.SetStorage("Token", data);
        this.ToPage("/Orders/OrderList");
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

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        Login: state.EmployeeService.Login
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Login", Login)));