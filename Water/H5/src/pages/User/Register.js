import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { Common, EnvConfig } from "UtilsCommon";
import Components from "Components";
import styles from "../../styles/View.scss";
const PropertyItem = Components.PropertyItem;

class Register extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "User_Register";

        this.Styles = styles;
        this.InitEventAction();

        this.PageConfig.Properties.forEach(p => this[p.Name] = p);

        this.state = { IsCompany: true, IsFirstStep:true };
		document.title = "借款客户注册";
    }

    componentDidMount() {
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('借款客户注册'));
		
        this.VerifyCodeView = this.PageConfig.DialogViews[0];
        //保存成功之后扩展设置。
        this.VerifyCodeView.ExpandSetSave = this.VerifyCodeSave.bind(this);
        //注册成功扩展设置
        this.PageConfig.ExpandSetSave = this.RegisterSave.bind(this);

        this.UserType.ValueChange = this.UserTypeChange.bind(this);
		
    }
    
	UserTypeBoxOnClick(value){
		this.UserType.Value = value;
		this.setState({ IsFirstStep: false },()=>{
			this.UserTypeChange(value);
			// if (this.UserType.SetValue)this.UserType.SetValue(value);
			// else this.UserType.Value = value;
			this.UserType.Value = value;
		});
		
	}
    
    UserTypeChange(value) {
        const isCompany = Common.IsEquals(value, 3);
        this.CompanyName.IsNullable = !isCompany;
        this.setState({ IsCompany: isCompany });
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
		console.log(data)
        this.ShowInfo(data.Data.message);
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
    
	// testMobileTitle(){
	// 	window.location.href = '/html/deposit/accredit.html'
	// }

    render() {
        const { IsFirstStep } = this.state;

        return (
            <div className="Container">
				{IsFirstStep &&
					<div className="Container2">
						<div className="Container4">
							<div className='WhiteSpace2'></div>
							<div className='WhiteSpace2'></div>
							<div className='WhiteSpace3'></div>
							<div className="userTypeBox" onClick={this.UserTypeBoxOnClick.bind(this, 3)}>
								<div className="Title">注册企业账户</div>
								<span>存管绑定企业银行卡</span>
								<span>单个账户最多借款100万元</span>
							</div>
							<div className='WhiteSpace2'></div>
							<div className='WhiteSpace3'></div>
							<div className="userTypeBox" onClick={this.UserTypeBoxOnClick.bind(this, 1)}>
								<div className="Title">注册个人账户</div>
								<span>存管绑定个人银行卡</span>
								<span>单个账户最多借款20万元</span>
							</div>
						</div>
					</div>
				}
				{!IsFirstStep &&
					<div className="Container2">
						<div className='Container3'>
							<div className='WhiteSpace1'></div>
							<div className='LogoImage' ><img alt="" src={this.GetImageUrl("ic_login_logo@2x.png")}/></div>
							{/*<div className='LogoImage' onClick={this.testMobileTitle.bind(this)}><img alt="" src={this.GetImageUrl("ic_login_logo@2x.png")}/></div>*/}
							{this.RenderPropertyItem(this.UserType)}
							
							<div className="WhiteSpace2"></div>
							<div className='LabelName'><span>企业名称</span></div>
							<div className='DivTextBox'>
								{this.RenderPropertyItem(this.CompanyName)}
							</div>
							
							{/*{IsCompany && <div className="WhiteSpace2"></div>}*/}
							{/*{IsCompany && <div className='LabelName'><span>企业名称</span></div>}*/}
							{/*{IsCompany && <div className='DivTextBox'>*/}
								{/*{this.RenderPropertyItem(this.CompanyName)}*/}
							{/*</div>}*/}
							<div className="WhiteSpace3"></div>
							<div className="LabelName"><span>手机号</span></div>
							<div className="DivTextBox">
								{this.RenderPropertyItem(this.Phone)}
							</div>
							<div className="WhiteSpace3"></div>
							<div className="LabelName"><span>验证码</span></div>
							{this.RenderPropertyItem(this.VerifyCode)}
							<div className="LabelName"><span>设置密码</span></div>
							{this.RenderPropertyItem(this.Password)}
							<div className="WhiteSpace4"></div>
							<div className="Agreement">
								{this.RenderPropertyItem(this.Agreement)}
								<a href="/modal/agreement">《新新贷注册使用协议》、</a>
							</div>
							<div className='Agreement'>
								<a href="/modal/risk" className='a1'>《资金出借风险提示函》</a>
							</div>
						</div>
						<div className='WhiteSpace5'></div>
						{this.RenderPropertyItem(this.RegButton)}
					</div>
				}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        CheckPhoneUnique: state.ApiH5Service.CheckPhoneUnique,
        SendTextVerifyCode: state.ApiH5Service.SendTextVerifyCode,
        SendVoiceVerifyCode: state.ApiH5Service.SendVoiceVerifyCode,
        // CompanyRegister: state.UserCenterService.CompanyRegister,
        // RegisterUser: state.ApiH5Service.RegisterUser
		Register:state.UserCenterService.Register,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("User_Register", Register)));