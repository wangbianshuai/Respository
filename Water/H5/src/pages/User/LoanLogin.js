import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig, Common} from "UtilsCommon";
import Components from "Components";
import JsBridge from "JsBridge"

const PropertyItem = Components.PropertyItem;
const ErrorMessage = Components.ErrorMessage;


class LoanLogin extends BaseIndex {
	constructor(props) {
		
		super(props);
		
		this.Name = "User_LoanLogin";
		
		this.InitEventAction();
		
		this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		
		this.Init();
	}
	
	Init() {
		document.title = "信贷员登录";
		
		this.RegButton = {
			Name: "RegButton",
			Type: "PressButton",
			Text: "登 录",
			DivClassName: "RegButton",
			PressClassName: "RegPre",
			NoPressClassName: "RegNor",
			EventActionName: "Login"
		};
		
		this.ErrorInfo = {Name: "ErrorInfo"};
	}
	
	componentDidMount() {
		this.Bridge = JsBridge();
		
		this.Bridge.Js2Native.InitInvoke(() => this.SetNavigatinBarTitle('信贷员登录'));
		
		Common.RemoveCookie("Token");
	}
	
	SetNavigatinBarTitle(title) {
		this.Bridge.Js2Native.SetNavigatinBarTitle(title);
	}
	
	GetImageUrl(name) {
		return require("../../assets/" + name);
	}
	
	Login() {
		if (this.IsLoading) return;
		this.IsLoading = true;
		
		const data = {};
		this.PageConfig.Properties.forEach(p => data[p.Name] = p.GetValue());
		
		const {Login} = this.ActionTypes;
		
		this.props.Invoke(Login, data);
	}
	
	ReceiveActionData(data) {
		const {Login, GetData, GetRoles} = this.ActionTypes;
		
		if (data[Login] !== this.props[Login]) {
			this.ReceiveLogin(data[Login]);
			return false;
		}
		if (data[GetData] !== this.props[GetData]) {
			this.ReceiveGetData(data[GetData]);
			return false;
		}
		if (data[GetRoles] !== this.props[GetRoles]) {
			this.ReceiveGetRoles(data[GetRoles]);
			return false;
		}
		
		return true;
	}
	
	ReceiveLogin(data) {
		this.IsLoading = false;
		if (data.IsSuccess === false || !data.access_token) {
			this.SetResponseFail(data.Message);
		} else {
			// this.SetResponseFail("");
			// this.AlertSuccess("登录成功！");
			//
			// this.Bridge.Js2Native.LoanLoginSuccess(data);
		}
	}
	
	ReceiveGetData(data){
		this.IsLoading = false;
		if (data.IsSuccess === false || !data.userId) {
			this.SetResponseFail(data.Message);
		} else {
			// this.SetResponseFail("");
			// this.AlertSuccess("登录成功！");
			// const LoanLoginData = JSON.parse(Common.GetCookie("LoanLoginData"));
			// this.Bridge.Js2Native.LoanLoginSuccess(LoanLoginData);
		}
	}
	
	ReceiveGetRoles(data){
		
		this.IsLoading = false;
		if (data.IsSuccess === false) {
			this.SetResponseFail(data.Message);
		} else {
			if(data.roleList && data.roleList.length > 0){
				const roleName = data.roleList.filter(f => f.roleName === '信贷员');
				
				if (roleName.length > 0){
					this.SetResponseFail("");
					this.AlertSuccess("登录成功！");
					
					const LoanLoginData = JSON.parse(Common.GetCookie("LoanLoginData"));
					this.Bridge.Js2Native.LoanLoginSuccess(LoanLoginData);
				}else{
					this.SetResponseFail("登录用户没有信贷员权限！");
				}
			}else{
				this.SetResponseFail("登录用户没有信贷员权限！");
			}
		}
	}
	
	SetResponseFail(msg) {
		this.ErrorInfo.Show(msg);
		this.IsLoading = false;
	}
	
	RenderPropertyItem(p) {
		
		return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
	}
	
	
	render() {
		return (
			<div className="Container">
				<div className="Container2">
					<div className="Container3 LoanLoginWrap">
						<div className="WhiteSpace1"></div>
						<div className="WhiteSpace5"></div>
						<div className="WhiteSpace5"></div>
						<div className="WhiteSpace5"></div>
						<div className="LogoImage"><img alt="" src={this.GetImageUrl("ic_home_logo@2x.png")}/></div>
						<div className="WhiteSpace2"></div>
						<div className="DivTitle"><span>信贷员登录</span></div>
						<div className="DivLogin">
							<div className="DivLogin2">
								<div className="WhiteSpace3"></div>
								<div className="LabelName"><span>Boss用户名</span></div>
								<div className="DivTextBox">
									{this.RenderPropertyItem(this.UserName)}
								</div>
								<div className="LabelName"><span>登录密码</span></div>
								{this.RenderPropertyItem(this.Password)}
								<div className="WhiteSpace4"></div>
								<ErrorMessage Property={this.ErrorInfo}/>
							</div>
						</div>
						{this.RenderPropertyItem(this.RegButton)}
						<div className="WhiteSpace5"></div>
						<div className="DivRemark"><span>注：如需要请登录BOSS系统进行密码找回和修改</span></div>
					</div>

				</div>
			</div>
		)
	}
}


function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		LoanLogin: state.AuthService.LoanLogin,
		GetData: state.UserService.GetData,
		GetRoles: state.UserService.GetRoles
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("User_LoanLogin", LoanLogin)));