import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig, Common} from "UtilsCommon";
import {Button} from "antd-mobile"

class OpenAccountResult extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_OpenAccountResult";
		
		this.InitEventAction();
		
		this.state = {
			fileStatus: 0,
			stepIndex:'3'
		}
		
		document.title = "存管开户";
		
	}
	
	componentDidMount(){
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('存管开户'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('存管开户');
		
		const {OpenAccuontResult} = this.ActionTypes;
		
		this.props.Invoke(OpenAccuontResult);
	}
	
	ReceiveActionData(data) {
		const {OpenAccuontResult} = this.ActionTypes;
		
		if (data[OpenAccuontResult] !== this.props[OpenAccuontResult]) {
			this.ReceiveOpenAccuontResult(data[OpenAccuontResult]);
			return false;
		}
		return true;
	}
	
	ReceiveOpenAccuontResult(data) {
		
		if (data.IsSuccess === false) {
			this.ShowInfo(data.Message);
		} else {
			//后端时而返回数字型时而返回字符串型。。
			data.status = data.status +'';
			if (data.status === "0"){
				this.setState({stepIndex: "0"});
				const url = '/Company/OpenAccountDetail.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken')
				this.ToPage(url);
			}
			
			if(this.toUploadFilesPage  && data.status === '3'){
				const url = '/Company/UploadOpenAccountFile.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken')
				this.ToPage(url);
				this.toUploadFilesPage = false;
			}
			// 开户状态 1:成功，3：审核中，其他：失败
			this.setState({stepIndex: data.status});
			
			this.setState({fileStatus: data.fileStatus});
			// this.fileStatus = data.fileStatus;
			
			if (data.status === "3") {
				this.SetTimeoutRefresh();
			}
			
			
		}
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
		const {OpenAccuontResult} = this.ActionTypes;
		
		this.props.Invoke(OpenAccuontResult);
	}
	
	componentWillUnmount(){
		window.clearTimeout(this.Timer);
	}
	
	
	
	GetImageUrl(name) {
		return require(`../../assets/${name}`);
	}
	
	JulpUploadFilesPage() {
		this.toUploadFilesPage = true;
		this.RefreshArtificial();
		// const url = '/Company/UploadOpenAccountFile.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken')
		// this.ToPage(url);
		return;
	}
	
	JulpOpenAccountDetail() {
		const url = '/Company/OpenAccountDetail.html?token='+ Common.GetQueryValue('token')+'&loanToken=' + Common.GetQueryValue('loanToken')
		this.ToPage(url);
		return;
	}
	
	JulpToOpenAccountStatusPage() {
		this.Bridge.Js2Native.ToPop(0,3);
		// this.Bridge.Js2Native.OpenAccountResult();
	}
	
	render(){
		const {stepIndex, fileStatus } = this.state;
		
		return (
			<div className="OpenAccountDetailBox">
				{/*审核中*/}
				{
					stepIndex === "3" &&
					<div className="show-artificial">
						<div className="artificial-cur">
							<div className="WhiteSpaceArt1"></div>
							<img src={this.GetImageUrl('artificial-check.png')} alt=""/>
							<div className="DivArtStatus">
								<span>存管开户审核中</span>
								<a onClick={this.RefreshArtificial.bind(this)} href="javascript:void (0)"><img src={this.GetImageUrl("refresh.png")} alt=""/></a>
							</div>
						</div>
						<div className="WhiteSpace2"></div>
						<div className="WhiteSpace3"></div>
						<div className="WhiteSpace4"></div>
						<div className="ErrorMsg">
								<span>
									{fileStatus === 1 && '开户附件已提交，若需补充或修改开户附件，请在银行审核结果返回之后再修改'}
									{fileStatus === 2 && '开户附件'}{fileStatus === 2 && <span className="ColorRed">提交失败</span>}{fileStatus === 2 && '，请在银行审核结果返回之后再修改'}
									{fileStatus === 0 && '开户附件等待存管行审核，大约1～2分钟！'}
								</span>
						</div>
						<div className="WhiteSpace3"></div>
						{ fileStatus !== 0 && <Button onClick={this.JulpUploadFilesPage.bind(this)} className="JulpToIndexButton" type={fileStatus === 1 ? "default" : "primary"}>{fileStatus === 1 ? '修改开户附件':'去上传开户附件'}</Button> }
						<div className="WhiteSpace3"></div>
						{/*<Button onClick={this.JulpToOpenAccountStatusPage.bind(this)} className="JulpToIndexButton" type="default" >返回</Button>*/}
					</div>
				}
				{/*审核成功或失败*/}
				{
					stepIndex !== "0" && stepIndex !== "3" &&
					<div className="show-result">
						<div className="result-cur">
							<div className="WhiteSpaceArt1"></div>
							<img src={stepIndex === "1" ? this.GetImageUrl('ic_great@2x.png') : this.GetImageUrl('ic_miss@2x.png') } alt=""/>
							
							<div className="resultStatus">
								<span className="fs20">{stepIndex === "1" ? '开户成功':'开户失败'}</span>
								<div className="WhiteSpace4"></div>
								{ stepIndex === "1" && <span className="fs16">开户审核通过</span> }
							</div>
						
						</div>
						
						<div className="WhiteSpace4"></div>
						<Button onClick={this.JulpToOpenAccountStatusPage.bind(this)} className="JulpToIndexButton" type="primary" >完成</Button>
					</div>
				}
			</div>
		)
	}
	
}


function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		
		OpenAccuontResult: state.UserCenterService.OpenAccuontResult,
		GetCompanyUploadFiles: state.UserCenterService.CompanyUploadFiles,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_OpenAccountResult", OpenAccountResult)));

