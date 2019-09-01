import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import Components from "Components";
import {EnvConfig,Common} from "UtilsCommon";
import styles from "../../styles/View.scss";
import JsBridge from "JsBridge";
const PropertyItem = Components.PropertyItem;

class OpenAccountDetail extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_OpenAccountDetail";
		
		this.Styles = styles;
		
		this.InitEventAction();
		
		this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		
		this.Init();
		
		this.state = {
			EntityData:{},
			BankApproStatus: false,
			uploadFilesStatus: false,
		}
	}
	
	Init() {
		document.title = "企业开户信息确认";
		this.ToOpenAccount = {
			Name: "ToOpenAccount",
			Text: "前往开户",
			Type: "Button",
			ButtonType: "primary",
			EventActionName: 'openAccount'
		};
		
		this.JumpToLoanButton = {
			Name: "ToLoanButton",
			Text: "跳过开户",
			Type: "Button",
			ButtonType: "",
			EventActionName: 'JulpToBack'
		};
	}
	
	componentDidMount() {
		this.Bridge = JsBridge();
		
		this.DontOpenAccountGetData();
		
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('企业开户信息确认'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('企业开户信息确认')
		
	}
	
	openAccount() {
		const {BankApproStatus, uploadFilesStatus} =this.state;
		if (!uploadFilesStatus) {
			this.ShowInfo('请完成开户附件资料上传');
			return;
		}
		if (!BankApproStatus) {
			this.ShowInfo('请完成对公信息认证');
			return;
		}
		if (BankApproStatus && uploadFilesStatus) {
			//	对公信息和上传附件都已完成
			const {GetOpenFuiouOpenAccountPageParams} = this.ActionTypes;
			this.props.Invoke(GetOpenFuiouOpenAccountPageParams);
		}
	}
	
	ToUploadPage() {
		
		const url = '/Company/UploadOpenAccountFile.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken');
		this.ToPage(url)
	}
	
	ToBankAuthPage() {
		const {BankApproStatus} =this.state;
		if (!BankApproStatus) {
			
			const url = '/Company/AccountInfoAuth.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken')
			this.ToPage(url)
		}
	}
	
	DontOpenAccountGetData() {
		const {OpenAccuontUserInfo, BankApproStatus, UploadFileStatus} = this.ActionTypes;
		this.props.Invoke(OpenAccuontUserInfo);
		this.props.Invoke(BankApproStatus);
		this.props.Invoke(UploadFileStatus);
	}
	
	ReceiveActionData(data) {
		const {OpenAccuontUserInfo, BankApproStatus, UploadFileStatus} = this.ActionTypes;
		
		if (data[OpenAccuontUserInfo] !== this.props[OpenAccuontUserInfo]) {
			this.ReceiveOpenAccuontUserInfo(data[OpenAccuontUserInfo]);
			return false;
		}
		if (data[BankApproStatus] !== this.props[BankApproStatus]) {
			this.ReceiveBankApproStatus(data[BankApproStatus]);
			return false;
		}
		if (data[UploadFileStatus] !== this.props[UploadFileStatus]) {
			this.ReceiveUploadFileStatus(data[UploadFileStatus]);
			return false;
		}
		
		return true;
	}
	
	ReceiveOpenAccuontUserInfo(data) {
		if (data.IsSuccess === false) this.ShowInfo(data.Message);
		else {
			this.setState({EntityData:data})
			const viewProperties = this.PageConfig.Properties.filter(f => f.IsView);
			viewProperties.forEach((p) => {
				if (p.Name === 'userAttr') {
					this[p.Name].Value = '借款人'
				}
				if (data[p.Name]) {
					if (this[p.Name].SetValue) this[p.Name].SetValue(data[p.Name]);
					else this[p.Name].Value = data[p.Name];
				}
			});
		}
	}
	
	ReceiveBankApproStatus(data) {
		if (data.IsSuccess === false) this.ShowInfo(data.Message);
		else {
			if (data.status === '已认证') {
				this.setState({BankApproStatus: true});
				
				this.PageConfig.Properties.forEach(p => {
					if (data[p.Name]) {
						if (this[p.Name].SetValue) this[p.Name].SetValue(data[p.Name]);
						else this[p.Name].Value = data[p.Name];
					}
				});
				
			}
		}
	}
	
	ReceiveUploadFileStatus(data) {
		if (data.IsSuccess === false) this.ShowInfo(data.Message);
		else {
			//“isUpload”：“1：已上传，0：未上传”，
			if (data.isUpload === 1) this.setState({uploadFilesStatus: true});
		}
	}
	
	JulpUploadFilesPage() {
		const url = '/Company/UploadOpenAccountFile.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken')
		this.ToPage(url);
		return;
	}
	
	JulpToBack() {
		this.Bridge.Js2Native.ToPop(0,3);
	}
	
	RenderPropertyItem(p) {
		return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
	}
	
	render() {
		
		return (
			<div className="Container OpenAccountDetailBox">
				<div className="Container2">
					<div className="c-openaccount-main">
						<div className="WhiteSpace2"></div>
						<div className="WhiteSpace3"></div>
						<div className="SpanTitle2"><span>请核对企业信息</span></div>
						{this.RenderPropertyItem(this.frName)}
						{this.RenderPropertyItem(this.frIdNumber)}
						{this.RenderPropertyItem(this.regMobile)}
						{this.RenderPropertyItem(this.companyName)}
						{this.RenderPropertyItem(this.userAttr)}
					</div>
					<div className="WhiteSpace1"></div>
					<div className="c-openaccount-main">
						<div className="am-list-item am-list-item-middle">
							<div className="am-list-line" onClick={this.ToUploadPage.bind(this)}>
								<div className="am-list-content">开户附件材料</div>
								<div className="am-list-extra">{this.state.uploadFilesStatus ? "已上传" : "未上传"}</div>
								<div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="false"></div>
							</div>
						</div>
						<div className="am-list-item am-list-item-middle">
							<div className="am-list-line" onClick={this.ToBankAuthPage.bind(this)}>
								<div className="am-list-content">对公信息认证</div>
								<div className="am-list-extra">{this.state.BankApproStatus ? "已认证" : "未认证"}</div>
								<div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true"></div>
							</div>
						</div>
						{ this.state.BankApproStatus &&
						<div>
							<div className="WhiteSpace3"></div>
							{this.RenderPropertyItem(this.bankName)}
							{this.RenderPropertyItem(this.branchName)}
							{this.RenderPropertyItem(this.companyBankno)}
						</div>
						}
					</div>
					<div className="WhiteSpace2"></div>
					<div className="DivRemark"><span>※ 若信息有误，请联系区域对接人进行修改。</span></div>
					<div className="WhiteSpace2"></div>
					<div className="ButtonWrap">
						{this.RenderPropertyItem(this.ToOpenAccount)}
						<div className="WhiteSpace2"></div>
						{this.RenderPropertyItem(this.JumpToLoanButton)}
					</div>
					<div className="WhiteSpace3"></div>
					<div className="DivRemark1">
						<span>※  企业开户可先跳过，但必须在面签前完成开户</span>
					</div>
				</div>
			</div>
		
		)
	}
}

function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		OpenAccuontUserInfo: state.UserCenterService.OpenAccuontUserInfo,
		GetBankAppro: state.UserCenterService.BankAppro,
		GetCompanyUploadFiles: state.UserCenterService.CompanyUploadFiles,
		OpenFuiouOpenAccountInfo: state.UserCenterService.OpenFuiouOpenAccountInfo,
		
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_OpenAccountDetail", OpenAccountDetail)));

