import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig, Common} from "UtilsCommon";
import Components from "Components";
import styles from "../../styles/View.scss";
const PropertyItem = Components.PropertyItem;
const ErrorMessage = Components.ErrorMessage;
const AuditStatus = Components.AuditStatus;

class RealNameAuth extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_RealNameAuth";
		
		this.Styles = styles;
		
		this.InitEventAction();
		
		this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		
		this.state = {IsToArtificial: false, IsShowArtificialButton: false, StepIndex: -1};
		
		this.Init();
	}
	
	Init() {
		document.title = "法人实名认证";
		this.ArtificialButton = {
			Name: "ArtificialButton",
			Type: "Button",
			Text: "人工审核",
			ClassName: 'ArtificialButton',
			Size: 'small',
			EventActionName: 'ExpandShowArtificial'
		};
		this.ExitArtificialButton = {
			Name: "ExitArtificialButton",
			Type: "Button",
			Text: "退出人工审核",
			ClassName: 'ArtificialButton',
			Size: 'small',
			EventActionName: 'ExpandExitArtificial'
		};
		
		this.ErrorInfo = {Name: "ErrorInfo"};
	}
	
	componentDidMount() {
		// this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('法人实名认证'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('法人实名认证');
		
		const {EnterpriseOpenAcntProgressQuery, userInfoRate} = this.ActionTypes;
		this.props.Invoke(EnterpriseOpenAcntProgressQuery);
		this.props.Invoke(userInfoRate);
	}
	
	getStatus(){
		const {EnterpriseOpenAcntProgressQuery} = this.ActionTypes;
		this.props.Invoke(EnterpriseOpenAcntProgressQuery);
		// this.props.Invoke(userInfoRate);
	}
	
	DoCompanyRealname() {
		if (this.IsLoading) return;
		this.IsLoading = true;
		
		const data = {};
		const viewProperties = this.PageConfig.Properties.filter((f)=>{
			return f.IsEdit && f.IsVisible !== false
		} );
		
		viewProperties.forEach(p => {
			if (p.GetValue) data[p.Name] = p.GetValue()
		});
		data.cardType = 1;
		data.isToArtificial = this.state.IsToArtificial;
		const {DoCompanyRealname} = this.ActionTypes;
		this.props.Invoke(DoCompanyRealname, data);
	}
	
	ExpandShowArtificial() {
		this.IsLoading = false;
		this.setState({IsToArtificial: true})
	}
	
	ExpandExitArtificial() {
		this.IsLoading = false;
		this.setState({IsToArtificial: false})
	}
	
	ReceiveActionData(data) {
		const {DoCompanyRealname, EnterpriseOpenAcntProgressQuery} = this.ActionTypes;
		
		if (data[DoCompanyRealname] !== this.props[DoCompanyRealname]) {
			this.ReceiveDoCompanyRealName(data[DoCompanyRealname]);
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
			this.GetOpenAccountProgress(data)
		}
		
		return true;
	}
	
	ReceiveDoCompanyRealName(data) {
		// const isToArtificial = this.state.isToArtificial;
		if (data.IsSuccess === false) {
			this.SetResponseMessage(data.Message);
			if (data.Code === -4 ) {
				this.ExpandShowArtificial();
			}
			else {
				!this.state.IsShowArtificialButton && data.IsValidate !== false && this.setState({ IsShowArtificialButton: true });
			}
		}
		else {
			this.AlertSuccess('提交成功');
			window.setTimeout(() => {
				this.RefreshArtificial();
			}, 800);
		}
	}
	
	SetResponseMessage(msg) {
		this.ErrorInfo.Show(msg);
		this.IsLoading = false;
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
		this.getStatus()
	}
	
	componentWillUnmount(){
		window.clearTimeout(this.Timer);
	}
	
	ResetStatus(){
		this.setState({StepIndex: -1});
		this.ExpandExitArtificial()
	}
	
	GetOpenAccountProgress(data) {
		// const {EnterpriseOpenAcntProgressQuery} = this.ActionTypes;
		// const data = this.props[EnterpriseOpenAcntProgressQuery];
		
		if (Common.IsEmptyObject(data) || !this.IsSuccessNextsProps(data)) return {};
		
		const {companyRealNameApproStatus, companyRealNameApproFailedTimes} = data;
		
		const d = {
			StepIndex: -1,
			IsToArtificial: false,
			IsShowArtificialButton: false
		};
		
		//StepIndex -1 未认证    StepIndex 0 审核中   StepIndex 1 认证成功      StepIndex 2 认证失败
		if (companyRealNameApproStatus !== '1') {
			if (companyRealNameApproStatus === '5') {
				//  审核中
				d.StepIndex = 0;
				this.SetTimeoutRefresh();
			}
			if (companyRealNameApproStatus === '2') {
				//  失败
				d.StepIndex = 2;
			}
			// 2, 3, 4
			if (companyRealNameApproFailedTimes >= 3) {
				// 跳转人工审核
				d.IsToArtificial = true;
				this.setState({IsToArtificial: true})
			}
			if (companyRealNameApproFailedTimes > 0) {
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
		const isToArtificial = this.state.IsToArtificial;
		const isShowArtificialButton = this.state.IsShowArtificialButton;
		
		return (
			<div className='Container'>
				<div className='Container2'>
					{!Common.IsEmptyObject(Status) && StepIndex === -1 &&
					<div className="Container4">
						<div className="WhiteSpace3"></div>
						<div className="WhiteSpace2"></div>
						<div className="LabelName"><span>法人姓名</span></div>
						<div className="DivTextBox">
							{this.RenderPropertyItem(this.realName)}
						</div>
						<div className="WhiteSpace3"></div>
						<div className="LabelName"><span>法人身份证号</span></div>
						<div className='DivTextBox'>
							{this.RenderPropertyItem(this.idCardNumber)}
						</div>
						<div className="authUploadImgWrap">
							{isToArtificial && this.RenderPropertyItem(this.positivePicID)}
							{isToArtificial && this.RenderPropertyItem(this.negativePicID)}
							{isToArtificial &&
							<div className="UploadRemark"><span>请上传jpg、jpeg、png格式照片，大小在10M以内</span></div>}
						</div>
						
						<div className="WhiteSpace4"></div>
						<div className="WhiteSpace4"></div>
						<ErrorMessage Property={this.ErrorInfo}/>
						{isShowArtificialButton && !isToArtificial && this.RenderPropertyItem(this.ArtificialButton)}
						{isShowArtificialButton && isToArtificial && this.RenderPropertyItem(this.ExitArtificialButton)}
						<div className="WhiteSpace4"></div>
						<div className="WhiteSpace4"></div>
						<div className="WhiteSpace4"></div>
						{this.RenderPropertyItem(this.CompanyRealName)}
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
		DoCompanyRealname: state.UserCenterService.DoCompanyRealname,
		DoManualCompanyRealname: state.UserCenterService.DoManualCompanyRealname,
		Files: state.FileCenterService.Files,
		UploadFiles: state.FileCenterService.UploadFiles,
		userInfoRate:state.UserCenterService.userInfoRate,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_RealNameAuth", RealNameAuth)));