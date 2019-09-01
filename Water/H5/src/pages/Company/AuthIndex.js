import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import Components from "Components";
import {EnvConfig,Common} from "UtilsCommon";
import styles from "../../styles/View.scss";
import JsBridge from "JsBridge";
const PropertyItem = Components.PropertyItem;

class AuthIndex extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_AuthIndex";
		
		this.Styles = styles;
		
		this.InitEventAction();
		
		this.Init();
		
		this.state = {
			RealNameAuthStatus: false,
			EnterpriseAuthStatus:false
		}
	}
	
	Init() {
		document.title = "企业认证";
		
		
		this.ToOpenAccount = {
			Name: "ToOpenAccount",
			Text: "返回",
			Type: "Button",
			ButtonType: "primary",
			EventActionName: 'OpenToListPage'
		};
	}
	
	componentDidMount() {
		this.Bridge = JsBridge();
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('企业认证'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('企业认证')
		
		const {userInfoRate} = this.ActionTypes;
		this.props.Invoke(userInfoRate);
		
	}
	
	OpenToListPage() {
		this.Bridge.Js2Native.ToPop(0,3);
		// this.Bridge.Js2Native.UserAuthSuccess();
	}
	
	ReceiveActionData(data) {
		const {userInfoRate} = this.ActionTypes;
		
		if (data[userInfoRate] !== this.props[userInfoRate])
			return this.ReceiveuserInfoRate(data[userInfoRate]);
		return true;
	}
	
	ReceiveuserInfoRate(data) {
		// console.log(data)
		if (data.IsSuccess === false) {
			this.ShowInfo(data.Message);
			return false;
		}else{
			const {frApproStatus, companyApproStatus} = data;
			if (frApproStatus === "已认证") this.setState({RealNameAuthStatus:true});
			if (companyApproStatus === "已认证") this.setState({EnterpriseAuthStatus:true});
			
			return true;
		}
	}
	
	goToRealNameAuthPage(){
		const {RealNameAuthStatus} = this.state;
		
		const url = '/Company/RealNameAuth.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken');
		if (!RealNameAuthStatus) {
			this.ToPage(url) ;
			return ;
		}
	}
	
	goToEnterpriseAuthPage(){
		const { RealNameAuthStatus,EnterpriseAuthStatus } = this.state;
		
		if (!RealNameAuthStatus) {
			this.ShowInfo('请先完成法人实名认证');
			return;
		}else{
			const url = '/Company/EnterpriseAuth.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken');
			if (!EnterpriseAuthStatus) {
				this.ToPage(url) ;
			}
		}
		
	}
	
	
	
	RenderPropertyItem(p) {
		return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
	}
	
	render() {
		const {RealNameAuthStatus, EnterpriseAuthStatus} = this.state;
		// console.log(RealNameAuthStatus)
		return (
			<div className="Container2">
				<div className="WhiteSpace1"></div>
				<div className="AuthIndex-main">
					<div className="am-list-item am-list-item-middle">
						<div className="am-list-line">
							<div className="am-list-content">法人实名认证</div>
							<div className="am-list-extra" onClick={ this.goToRealNameAuthPage.bind(this) }>{RealNameAuthStatus ? "已认证" : "未认证"}</div>
							<div className="am-list-arrow am-list-arrow-horizontal"></div>
						</div>
					</div>
					<div className="am-list-item am-list-item-middle">
						<div className="am-list-line">
							<div className="am-list-content">企业认证</div>
							<div className="am-list-extra" onClick={ this.goToEnterpriseAuthPage.bind(this) }>{EnterpriseAuthStatus ? "已认证" : "未认证"}</div>
							<div className="am-list-arrow am-list-arrow-horizontal"></div>
						</div>
					</div>
				</div>
				<div className="WhiteSpace1"></div>
				<div className="ButtonWrap">
					{this.RenderPropertyItem(this.ToOpenAccount)}
					
				</div>
			</div>
		)
	}
}


function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		// EnterpriseOpenAcntProgressQuery: state.UserCenterService.EnterpriseOpenAcntProgressQuery,
		userInfoRate:state.UserCenterService.userInfoRate,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_AuthIndex", AuthIndex)));


