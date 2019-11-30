import { useEffect, useMemo } from "react";
import { PageAxis, RootPage, useConnectAction } from "ReactCommon";
import { Common } from "UtilsCommon";
import Components from "Components";
import styles from "../styles/Login.css"

const Name = "Login";

const Login = (props) => {
    const [invoke, actionTypes, actionData] = useConnectAction(Name)
    const pageAxis = useMemo(() => new PageAxis(Name), []);

    pageAxis.InitSet(props, invoke, actionTypes, Init);

    useEffect(() => pageAxis.ReceiveActionData(actionData), [pageAxis, actionData]);

    return (
        <div className={styles.DivContainer}>
            <div className={styles.DivLogin}>
                <Components.PropertyItem Property={pageAxis.PageConfig} PageAxis={pageAxis} />
            </div>
        </div>
    )
}

function Init(pageAxis) {
    Common.RemoveCookie("Token");
    pageAxis.props.SetActionState("ApiService", "Login");

    pageAxis.ExpandMethod({ LoginSuccess });
    return pageAxis;
}

function LoginSuccess(pageAxis) {
    return ({ data, props, action }) => {
        Common.SetStorage("LoginUserInfo", JSON.stringify(data))
        Common.SetStorage("LoginUserId", data.UserId)
        pageAxis.ToPage("/PurchaseSaleManage/SaleInput");
    }
}

function mapStateToProps(state) {
    return {
        Login: state.ApiService.Login
    }
}

export default RootPage(Login, mapStateToProps);