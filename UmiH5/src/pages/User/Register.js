import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { Common, EnvConfig } from "UtilsCommon";
import Components from "Components";
import styles from "../../styles/User/Register.scss";
const PropertyItem = Components.PropertyItem;

class Register extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "User_Register";

        this.Styles = styles;
        this.InitEventAction();

        this.PageConfig.Properties.forEach(p => this[p.Name] = p);

        this.state = { IsCompany: false }
    }

    componentDidMount() {
        this.VerifyCodeView = this.PageConfig.DialogViews[0];
        //保存成功之后扩展设置。
        this.VerifyCodeView.ExpandSetSave = this.VerifyCodeSave.bind(this);
        //注册成功扩展设置
        this.PageConfig.ExpandSetSave = this.RegisterSave.bind(this);

        this.UserType.ValueChange = this.UserTypeChange.bind(this);
    }

    UserTypeChange(value) {
        const isCompany = Common.IsEquals(value, 2);
        this.CompanyName.IsNullable = !isCompany;
        this.setState({ IsCompany: isCompany })
    }

    //注册成功
    RegisterSave(data, props, action) {
        const token = typeof data === "string" ? data : data.token;
        Common.SetCookie("Token", token);
        this.UserRegisterSuccess();
    }

    UserRegisterSuccess() {
        this.props.Bridge.Js2Native.UserRegisterSuccess(this.Phone.GetValue())
    }

    GetImageUrl(name) {
        return require(`../../assets/${name}`);
    }

    RenderPropertyItem(p) {
        return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions} />
    }

    //保存成功之后扩展设置。
    VerifyCodeSave(data, props, action) {
        this.ShowInfo(data.message);
        this.VerifyCode.ShowSecondCount();
    }

    //自定义事件行为，方法名与配置名一致
    CheckPhoneUnique(props, action) {
        if (this.IsLoading) return;
        this.IsLoading = true;

        this.SelectSendType = props.SendType;

        const { CheckPhoneUnique } = this.ActionTypes;
        const data = { Phone: this.Phone.GetValue() }
        this.props.Invoke(CheckPhoneUnique, data);
    }

    //接收数据方法，规则Receive+数据行为方法名
    ReceiveCheckPhoneUnique(data) {
        if (data.IsSuccess === false) this.SetResponseFail(data.Message);
        else {
            this.IsLoading = false;
            const props = {
                EventActions: this.EventActions,
                EditData: { SendType: this.SelectSendType, Phone: this.Phone.GetValue() }
            }
            this.EventActions.InvokeAction("ShowVerifyCode", props);
        }
    }

    SetResponseFail(msg) {
        this.ShowInfo(msg);
        this.IsLoading = false;
    }

    render() {
        const { IsCompany } = this.state;

        return (
            <div className={styles.Container}>
                <div className={styles.Container2}>
                    <div className={styles.Container3}>
                        <div className={styles.WhiteSpace1}></div>
                        <div className={styles.LogoImage}><img alt="" src={this.GetImageUrl("ic_login_logo@2x.png")} /></div>
                        {this.RenderPropertyItem(this.UserType)}
                        {IsCompany && <div className={styles.WhiteSpace2}></div>}
                        {IsCompany && <div className={styles.LabelName}><span>企业名称</span></div>}
                        {IsCompany && <div className={styles.DivTextBox}>
                            {this.RenderPropertyItem(this.CompanyName)}
                        </div>}
                        <div className={styles.WhiteSpace3}></div>
                        <div className={styles.LabelName}><span>手机号</span></div>
                        <div className={styles.DivTextBox}>
                            {this.RenderPropertyItem(this.Phone)}
                        </div>
                        <div className={styles.WhiteSpace3}></div>
                        <div className={styles.LabelName}><span>验证码</span></div>
                        {this.RenderPropertyItem(this.VerifyCode)}
                        <div className={styles.LabelName}><span>设置密码</span></div>
                        {this.RenderPropertyItem(this.Password)}
                        <div className={styles.WhiteSpace4}></div>
                        <div className={styles.Agreement}>
                            {this.RenderPropertyItem(this.Agreement)}
                            <a href="/modal/agreement">《新新贷注册使用协议》、</a>
                        </div>
                        <div className={styles.Agreement}>
                            <a href="/modal/risk" className={styles.a1}>《资金出借风险提示函》</a>
                        </div>
                    </div>
                    <div className={styles.WhiteSpace5}></div>
                    {this.RenderPropertyItem(this.RegButton)}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        CheckPhoneUnique: state.ApiH5Service.CheckPhoneUnique,
        SendTextVerifyCode: state.ApiH5Service.SendTextVerifyCode,
        SendVoiceVerifyCode: state.ApiH5Service.SendVoiceVerifyCode,
        CompanyRegister: state.UserCenterService.CompanyRegister,
        RegisterUser: state.ApiH5Service.RegisterUser
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("User_Register", Register)));