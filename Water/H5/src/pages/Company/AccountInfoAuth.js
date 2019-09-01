import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import Components from "Components";
import {EnvConfig, Common} from "UtilsCommon";
import styles from "../../styles/View.scss";
import {Modal} from "antd-mobile";
const PropertyItem = Components.PropertyItem;
const ErrorMessage = Components.ErrorMessage;
const AuditStatus = Components.AuditStatus;


class AccountInfoAuth extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_AccountInfoAuth";
		
		this.Styles = styles;
		
		this.InitEventAction();
		
		this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		
		this.state = {
			IsToArtificial: false,
			IsShowArtificialButton: false,
			BankName: " ",
			BranchName: " "
		};
		
		this.Init();
	}
	
	Init() {
		document.title = "对公户信息";
		// this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('对公户信息'));
		
		this.ArtificialButton = {
			Name: "ArtificialButton",
			Text: "人工审核",
			Type: "Button",
			ClassName: 'ArtificialButton',
			Size: 'small',
			EventActionName: 'ShowArtificial',
		};
		this.ExitArtificialButton = {
			Name: "ExitArtificialButton",
			Text: "退出人工审核",
			Type: "Button",
			ClassName: 'ArtificialButton',
			Size: 'small',
			EventActionName: 'ExitArtificial',
		};
		
		this.ErrorInfo = {Name: "ErrorInfo"};
		
		this.PageConfig.Properties.forEach(p => {
			if (p.Name === "branchCode") {
				p.ValueChange = this.SearchBranchBank.bind(this);
				p.IsLoadValue = true;
			}
		});
	}
	
	componentDidMount() {
		// this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('对公户信息'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('对公户信息');
		
		this.getStatus();
	}
	
	getStatus(){
		const {EnterpriseOpenAcntProgressQuery} = this.ActionTypes;
		this.props.Invoke(EnterpriseOpenAcntProgressQuery);
	}
	
	ShowArtificial() {
		this.IsLoading = false;
		this.setState({IsToArtificial: true})
	}
	
	ExitArtificial() {
		this.IsLoading = false;
		this.setState({IsToArtificial: false})
	}
	
	//联行号检索
	SearchBranchBank(Value) {
		if (Value.length === 12) {
			if (this.IsLinkBankSelect) return;
			this.IsLinkBankSelect = true;
			
			this.CurrentBranchCode = Value;
			
			const {GetBranchInfoByBranchCode} = this.ActionTypes;
			this.props.Invoke(GetBranchInfoByBranchCode, {branchCode: this.CurrentBranchCode});
		}
	}
	
	//下一步
	OnNextStep() {
		if (this.IsLoading) return;
		
		const {EntityData} = this.PageConfig;
		
		let msg = ""
		const branchCode = this.branchCode.GetValue();
		if (!branchCode) msg = "请先输入联行号进行检索";
		else if (!this.CurrentBranchCode) msg = "请先对其联行号进行检索";
		else if (branchCode !== this.CurrentBranchCode) msg = `输入联行号与检索的${this.CurrentBranchCode}不一致`;
		else if (!EntityData || !EntityData.bankCode) msg = "不支持该银行网点，请更换其他银行卡";
		
		if (msg) {
			this.SetResponseMessage(msg);
			return;
		}
		this.IsLoading = true;
		
		const data = {
			comBankName: EntityData.bankName,
			comBankCode: EntityData.bankCode,
			provinceCode: EntityData.provinceCode,
			cityCode: EntityData.cityCode,
			comBranchName: EntityData.branchName,
		}
		const viewProperties = this.PageConfig.Properties.filter((f) => {
			return f.IsEdit
		});
		
		viewProperties.forEach(p => {
			if (p.GetValue) data[p.Name] = p.GetValue()
		});
		data.isToArtificial = this.state.IsToArtificial;
		
		this.BankData = data;
		
		const {CheckBankNoIsUse} = this.ActionTypes;
		this.props.Invoke(CheckBankNoIsUse, {comBankNo: data.comBankNo});
	}
	
	//数据请求之后接收数据
	ReceiveActionData(data) {
		const {EnterpriseOpenAcntProgressQuery,AutoCompanyBankAppro, ManualCompanyBankAppro,GetBranchInfoByBranchCode, CheckBankNoIsUse} = this.ActionTypes;
		
		if (data[AutoCompanyBankAppro] !== this.props[AutoCompanyBankAppro]) {
			this.ReceiveAutoCompanyAppro(data[AutoCompanyBankAppro]);
			return false;
		}
		if (data[ManualCompanyBankAppro] !== this.props[ManualCompanyBankAppro]) {
			this.ReceiveAutoCompanyAppro(data[ManualCompanyBankAppro]);
			return false;
		}
		if (data[GetBranchInfoByBranchCode] !== this.props[GetBranchInfoByBranchCode]) {
			this.ReceiveBranchInfoByBranchCode(data[GetBranchInfoByBranchCode]);
			return false;
		}
		if (data[CheckBankNoIsUse] !== this.props[CheckBankNoIsUse]) {
			this.ReceiveCheckBankNoIsUse(data[CheckBankNoIsUse]);
			return false;
		}
		if (data[EnterpriseOpenAcntProgressQuery] !== this.props[EnterpriseOpenAcntProgressQuery])
			return this.ReceiveEnterpriseOpenAcntProgressQuery(data[EnterpriseOpenAcntProgressQuery]);
		
		return true;
	}
	
	ReceiveEnterpriseOpenAcntProgressQuery(data) {
		if (data.IsSuccess === false) {
			this.ShowInfo(data.Message);
			return false;
		}else{
			this.GetOpenAccountProgress(data);
		}
		
		return true;
	}
	
	ReceiveCheckBankNoIsUse(data) {
		if (data.IsSuccess === false) this.SetResponseMessage(data.Message);
		else {
			const {AutoCompanyBankAppro} = this.ActionTypes;
			this.props.Invoke(AutoCompanyBankAppro, this.BankData);
		}
	}
	
	ReceiveAutoCompanyAppro(data) {
		// const isToArtificial = this.state.isToArtificial;
		if (data.IsSuccess === false) {
			if (data.Code === -4 || data.Code === -3) {
				this.SetResponseMessage(data.Message || "认证失败");
				this.ShowArtificial();
			}
			else {
				this.SetResponseMessage(data.Message || "认证失败");
				!this.state.IsShowArtificialButton && data.IsValidate !== false && this.setState({IsShowArtificialButton: true});
			}
		}
		else {
			// console.log(data);
			this.AlertSuccess('提交成功');
			window.setTimeout(() => {
				this.RefreshArtificial();
			}, 800);
		}
	}
	
	ReceiveBranchInfoByBranchCode(data) {
		
		this.IsLinkBankSelect = false;
		
		if (data.IsSuccess === false) {
			this.SetResponseMessage(data.Message);
			this.PageConfig.EntityData = null;
			this.SetEntityData(null);
		}
		else {
			if (data.Data) data = data.Data;
			
			this.SetResponseMessage("");
			
			this.PageConfig.EntityData = data;
			const bankCode = data.bankCode
			if (bankCode === '0313' || bankCode === '0314' || bankCode === '0402') {
				this.ShowArtificial();
			}
			
			this.SetEntityData(data);
		}
	}
	
	SetEntityData(data) {
		let bankName = "", branchName = "";
		if (data) {
			bankName = data.province + data.city + "，" + data.bankName;
			branchName = data.branchName;
		}
		this.setState({BankName: bankName, BranchName: branchName});
	}
	
	
	SetResponseMessage(msg) {
		if (msg === "未查询到相关支行信息，或联系技术中心") msg = "不支持该银行网点，请更换其他银行卡";
		this.ErrorInfo.Show(msg);
		this.IsLoading = false;
	}
	
	ShowBankCodeTip() {
		Modal.alert("提示", <div className="MoalTip"><span>请拨打开户支行客服热线获取联行号，准确的联行号可以提高开户成功率</span></div>);
	}
	
	GetImageUrl(name) {
		return require(`../../assets/${name}`);
	}
	
	SetTimeoutRefresh() {
		window.clearTimeout(this.Timer);
		this.Timer = window.setTimeout(() => {
			this.RefreshArtificial();
			this.SetTimeoutRefresh();
		}, 1000 * 60);
	}
	
	RefreshArtificial() {
		this.ToastLoaing();
		this.getStatus();
	}
	
	componentWillUnmount(){
		window.clearTimeout(this.Timer);
	}
	
	ResetStatus(){
		this.setState({StepIndex: -1});
		this.ExitArtificial()
	}
	
	GetOpenAccountProgress(data) {
		
		if (Common.IsEmptyObject(data) || !this.IsSuccessNextsProps(data)) return {};
		
		const {companyBankApproStatus, companyBankApproFailedTimes} = data;
		
		const d = {
			StepIndex: -1,
			IsToArtificial: false,
			IsShowArtificialButton: false
		};
		
		//StepIndex -1 未认证    StepIndex 0 审核中   StepIndex 1 认证成功      StepIndex 2 认证失败
		if (companyBankApproStatus !== '1') {
			if (companyBankApproStatus === '5') {
				//  审核中
				d.StepIndex = 0;
				this.SetTimeoutRefresh();
			}
			if (companyBankApproStatus === '2') {
				//  失败
				d.StepIndex = 2;
			}
			// 2, 3, 4
			if (companyBankApproFailedTimes >= 3) {
				// 跳转人工审核
				d.IsToArtificial = true;
				this.setState({IsToArtificial: true})
			}
			if (companyBankApproFailedTimes > 0) {
				// 显示人工审核按钮
				d.IsShowArtificialButton = true;
				this.setState({IsShowArtificialButton: true})
			}
			
		} else {
			d.StepIndex = 1;
		}
		this.setState({StepIndex: d.StepIndex});
		this.StatusData = d;
	}
	
	GoBack(){
		this.ToGoBack()
	}
	
	RenderPropertyItem(p) {
		return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
	}
	
	
	render() {
		const {StepIndex} = this.state;
		const Status = this.StatusData;
		const isToArtificial = this.state.IsToArtificial ;
		const isShowArtificialButton = this.state.IsShowArtificialButton;
		
		const {BankName, BranchName} = this.state;
		
		return (
			<div className="Container">
				<div className="Container2">
					{!Common.IsEmptyObject(Status) && StepIndex === -1 &&
					<div className="Container4">
						<div className="WhiteSpace1"></div>
						<div className="WhiteSpace2"></div>
						<div className="LabelName">
							<span>联行号</span>
							<a className="aLookBankCode" onClick={this.ShowBankCodeTip.bind(this)} href="#addofwran">（如何获取联行号？）</a>
						</div>
						<div className="DivTextBox2">
							{this.RenderPropertyItem(this.branchCode)}
							{/*<div className="SearchButton" onClick={this.SearchBranchBank.bind(this)}><span>检 索</span></div>*/}
						</div>
						<div className="WhiteSpace2"></div>
						<div className="DivBankInfo">
							<p>开户行：{BankName}</p>
							<p>支行名称：{BranchName}</p>
						</div>
						<div className="WhiteSpace2"></div>
						<div className="LabelName"><span>对公户账户（放款的企业银行卡）</span></div>
						<div className="DivTextBox">
							{ this.RenderPropertyItem(this.comBankNo) }
						</div>
						{isToArtificial &&
						<div>
							<div className="WhiteSpace4"></div>
							{ this.RenderPropertyItem(this.openAccAppro_pic)}
							<div className="UploadRemark"><span>请上传jpg、jpeg、png格式照片，大小在10M以内</span></div>
						</div>
						}
						<div className="WhiteSpace3"></div>
						<ErrorMessage Property={this.ErrorInfo}/>
						<div className="WhiteSpace2"></div>
						{isShowArtificialButton && !isToArtificial && this.RenderPropertyItem(this.ArtificialButton) }
						{isShowArtificialButton && isToArtificial && this.RenderPropertyItem(this.ExitArtificialButton)  }
						{ this.RenderPropertyItem(this.NextStepButton) }
					</div>
					}
					
					{!Common.IsEmptyObject(Status) &&
					<AuditStatus StepIndex={StepIndex} GetImageUrl={this.GetImageUrl}
								 RefreshArtificial={this.RefreshArtificial.bind(this)} cbPage={this.GoBack.bind(this)} ResetStatus ={this.ResetStatus.bind(this)}/>}
				
				</div>
			
			</div>
		)
	}
}


function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		EnterpriseOpenAcntProgressQuery: state.UserCenterService.EnterpriseOpenAcntProgressQuery,
		BranchInfoByBranchCode: state.UserCenterService.BranchInfoByBranchCode,
		CheckBankNoIsUse: state.UserCenterService.CheckBankNoIsUse,
		AutoCompanyBankAppro: state.UserCenterService.AutoCompanyBankAppro,
		ManualCompanyBankAppro: state.UserCenterService.ManualCompanyBankAppro,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

//BranchInfoByBranchCode 根据联行号查询企业对公户信息
//CheckBankNoIsUse 检查银行卡号是否被使用
export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_AccountInfoAuth", AccountInfoAuth)));

