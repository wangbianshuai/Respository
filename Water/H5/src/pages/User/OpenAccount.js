import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig} from "UtilsCommon";
import Components from "Components";
const PropertyItem = Components.PropertyItem;

class OpenAccount extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "User_OpenAccount";

        this.InitEventAction();

        this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		
        document.title = "个人开户信息";
    }
	
	componentDidMount() {
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('个人开户信息'));
		
		if (!this.Token) this.IsLoading = true;
		else this.GetUserInfo()
	}
	
	GetUserInfo() {
		const { UserInfo } = this.ActionTypes;
		this.props.Invoke(UserInfo);
	}
	
	GetUserAccount() {
		const { GetUserAccount } = this.ActionTypes;
		this.props.Invoke(GetUserAccount);
	}
	
	UserOpenAccount() {
		//1.判断是否已经进行实名认证；未认证=》进行实名认证，已认证=》
		if (this.IsLoading) return;
		this.IsLoading = true;
		
		const data = {};
		const viewProperties = this.PageConfig.Properties.filter((f)=>{
			return f.IsEdit && f.IsVisible !== false
		} );
		
		viewProperties.forEach(p => {
			if (p.GetValue) data[p.Name] = p.GetValue()
		});
		
		if (this.UserInfo.isRealName !== "1"){
			const { UserRealName } = this.ActionTypes;
			this.props.Invoke(UserRealName, data);
			return
		}
		
		if (!data.Agreement) {
			this.IsLoading = false;
			this.ShowInfo("开户前需同意《用户授权协议》");
			return
		}
		const { GetFuyouJump } = this.ActionTypes;
		this.props.Invoke(GetFuyouJump,data);
		return
		
	}
	
	AgreementValueChange(props){
		//改变之前的值
		// console.log(this.Agreement.GetValue())
		if(this.Agreement.GetValue()){
			this.userOpenAccountButton.SetDisabled(true)
		}else{
			this.userOpenAccountButton.SetDisabled(false)
		}
	}
	
	ReceiveActionData(data) {
		const {UserInfo, GetUserAccount, UserRealName,GetFuyouJump } = this.ActionTypes;
		
		if (data[UserInfo] !== this.props[UserInfo]) { this.ReceiveGetUserInfo(data[UserInfo]); return true; }
		if (data[GetUserAccount] !== this.props[GetUserAccount]) { this.ReceiveGetUserAccount(data[GetUserAccount]); return true; }
		if (data[UserRealName] !== this.props[UserRealName]) { this.ReceiveUserRealName(data[UserRealName]); return false; }
		if (data[GetFuyouJump] !== this.props[GetFuyouJump]) { this.ReceiveGetFuyouJump(data[GetFuyouJump]); return false; }
		
		return true;
	}
	
	//接收用户是否实名认证
	ReceiveGetUserInfo(data) {
		this.IsLoading = false;
		if (data.IsSuccess === false) { this.ShowInfo(data.Message); this.IsLoading = true; }
		else {
			this.UserInfo = data;
			//用户已经实名认证
			if (data.isRealName === "1"){
				this.GetUserAccount()
			}
		}
	}
	
	ReceiveGetUserAccount(data) {
		this.IsLoading = false;
		if (data.IsSuccess === false) { this.ShowInfo(data.Message); this.IsLoading = true; }
		else {
			//用户实名认证的信息
			this.EntityData = data;
			if (data.userIdCard) {this.idCardNumber.SetValue(data.userIdCard);this.idCardNumber.SetDisabled(true)}
			if (data.userName)this.realName.SetValue(data.userName);this.realName.SetDisabled(true)
		}
	}
	
	ReceiveUserRealName(data) {
		this.IsLoading = false;
    	// console.log(data);
		if (data.IsSuccess === false) this.SetResponseMessage(data.Message);
		else{
			//实名认证之后，获取富友跳转参数
			if (data.Code === 0 || this.UserInfo.isRealName === '1'){
				const { GetFuyouJump } = this.ActionTypes;
				this.props.Invoke(GetFuyouJump);
			}
		}
	}
	
	ReceiveGetFuyouJump(data) {
		this.IsLoading = false;
		if (data.IsSuccess === false) { this.ShowInfo(data.Message); }
		else{
			
		}
		
	}
	
	SetResponseMessage(msg) {
		this.ShowInfo(msg);
		this.IsLoading = false;
	}

    RenderPropertyItem(p) {

        return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions} />
    }

    render() {
        return (
            <div className="OpenAccountBox">
				<div className="WhiteSpace2"></div>
				<div className="openAccountProgress">
					{this.RenderPropertyItem(this.realName)}
					{this.RenderPropertyItem(this.idCardNumber)}
					
					<div className="OpenAccountCheckBoxView">
						{this.RenderPropertyItem(this.Agreement)}
						<a href="/modal/licensingAgreement" className="userAgreement">《用户授权协议》</a>
					</div>
					{!this.Token && <div className="ErrorInfo"><span>未登录,请先登录或注册</span></div>}
					<div className="WhiteSpace4"></div>
					{this.RenderPropertyItem(this.userOpenAccountButton)}
					<div className="WhiteSpace3"></div>
					<div className="open-account-prompt">
						<div className="prompt">
							<div className="prompt-tit">为什么开通银行存管账户？</div>
							<div className="prompt-content">为了保障借款人的资金安全，新新贷全面采用银行存管的运营模式，只有成功开通了银行存管账户，才能再新新贷平台进行提现、借款等行为</div>
						</div>
					</div>
				</div>
				
                {/*<div className="openAccountResult">
					<div className="openaccount-result-top success-bg">
						<div className="manage-organization">
							<p>资金存管机构</p>
							<p>华瑞银行股份有限公司（简称：华瑞银行）</p>
						</div>
						<div className="circle-box">
							<span className="result-txt">开户成功</span>
						</div>
		
						<div className="wave-bg"></div>
					</div>
					<p className="openaccount-result-txt success-txt">存管账户开通成功!</p>
					<div className="div-btn success-btn block">
						<button className="xxd-xl-btn">立即评测</button>
					</div>
				</div>*/}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
		UserInfo: state.ApiH5Service.UserInfo,
		UserAccount: state.ApiH5Service.UserAccount,
		UserRealName: state.ApiH5Service.UserRealName,
		FuyouJump: state.ApiH5Service.FuyouJump
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}
//UserInfo 用户基本信息获取用户开户状态；UserAccount用户已开户的基本信息；UserRealName开户前实名认证 FuyouJump获取跳转富友的参数
export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("User_OpenAccount", OpenAccount)));
