import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig,Common} from "UtilsCommon";

import Components from "Components";
import styles from "../../styles/View.scss";
const PropertyItem = Components.PropertyItem;
const ErrorMessage = Components.ErrorMessage;
const AuditStatus = Components.AuditStatus;

class EnterpriseAuth extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Company_EnterpriseAuth";

        this.Styles = styles;

        this.InitEventAction();

        this.PageConfig.Properties.forEach(p => this[p.Name] = p);

        this.state = {IsToArtificial: false, IsShowArtificialButton: false, StepIndex:-1};

        this.Init();
    }

    Init() {
		document.title = "企业认证";
		// this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('企业认证'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('企业认证');
		
        this.ArtificialButton = {
            Name: "ArtificialButton",
            Type: "Button",
            Text: "人工审核",
            Size: 'small',
            ClassName:'ArtificialButton',
            EventActionName: "ShowArtificial"
        };
        this.ExitArtificialButton = {
            Name: "ExitArtificialButton",
            Type: "Button",
            Text: "退出人工审核",
            Size: 'small',
            ClassName:'ArtificialButton',
            EventActionName: "ExitArtificial"
        };

        this.ErrorInfo = {Name: "ErrorInfo"};
    }

    componentDidMount() {
        const {EnterpriseOpenAcntProgressQuery} = this.ActionTypes;
	
		this.props.Invoke(EnterpriseOpenAcntProgressQuery);
		
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

    getCompanyName(){
		const {GetCompanyInfo} = this.ActionTypes;
	
		this.props.Invoke(GetCompanyInfo);
	}
    
    AutoCompanyAppro() {
        if (this.IsLoading) return;
        this.IsLoading = true;

        const data = {};
		const viewProperties = this.PageConfig.Properties.filter((f)=>{
			return f.IsView && f.IsVisible !== false
		} );
		//
		viewProperties.forEach(p => {
			if (p.GetValue) data[p.Name] = p.GetValue()
		});
        data.isToArtificial = this.state.IsToArtificial;

        const {AutoCompanyAppro} = this.ActionTypes;
        this.props.Invoke(AutoCompanyAppro, data);
    }

    ReceiveActionData(data) {
        const {AutoCompanyAppro, GetCompanyInfo,EnterpriseOpenAcntProgressQuery} = this.ActionTypes;

        if (data[AutoCompanyAppro] !== this.props[AutoCompanyAppro]) {
            this.ReceiveAutoCompanyAppro(data[AutoCompanyAppro]);
            return false;
        }
        if (data[GetCompanyInfo] !== this.props[GetCompanyInfo]) {
            this.ReceiveCompanyInfo(data[GetCompanyInfo]);
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
	
	
	ReceiveCompanyInfo(data) {
        if (data.IsSuccess === false) this.ShowInfo(data.Message);
        else {
        	if (typeof this.companyName.SetValue === "function" && data.companyName && !Common.IsNullOrEmpty(data.companyName)){
        		
				this.companyName.SetValue(data.companyName);
			}
        }
    }

    ReceiveAutoCompanyAppro(data) {
        // const isToArtificial = this.state.isToArtificial;
        if (data.IsSuccess === false) {
            if (data.Code === -4) this.ShowArtificial();
            else {
                this.SetResponseMessage(data.Message || "认证失败");
                !this.state.IsShowArtificialButton && data.IsValidate !== false && this.setState({IsShowArtificialButton: true});
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
	
	ResetStatus(){
		this.setState({StepIndex: -1});
		this.getCompanyName();
		this.ExitArtificial();
	}
	
	componentWillUnmount(){
		window.clearTimeout(this.Timer);
	}
	
	GetImageUrl(name) {
		return require(`../../assets/${name}`);
	}
	
	
	GetOpenAccountProgress(data) {
		
		if (Common.IsEmptyObject(data) || !this.IsSuccessNextsProps(data)) return {};
		
		const {companyApproStatus, companyApproFailedTimes} = data;
		
		const d = {
			StepIndex: -1,
			IsToArtificial: false,
			IsShowArtificialButton: false
		};
		//StepIndex -1 未认证    StepIndex 0 审核中   StepIndex 1 认证成功      StepIndex 2 认证失败
		if (companyApproStatus !== '1') {
			if (companyApproStatus === '5') {
				//  审核中
				d.StepIndex = 0;
				this.SetTimeoutRefresh();
			}else{
				//非审核中，审核成功，获取企业名称
				this.getCompanyName()
			}
			if (companyApproStatus === '2') {
				//  失败
				d.StepIndex = 2;
			}
			// 2, 3, 4
			if (companyApproFailedTimes >= 3) {
				// 跳转人工审核
				d.IsToArtificial = true;
				this.setState({IsToArtificial: true})
			}
			if (companyApproFailedTimes > 0) {
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
	
    RenderPropertyItem(p) {
        return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
    }
	
	GoBack(){
		this.ToGoBack()
	}

    render() {
		const {StepIndex} = this.state;
		const Status = this.StatusData;
		const isToArtificial = this.state.IsToArtificial;
		const isShowArtificialButton = this.state.IsShowArtificialButton;
		
        return (
            <div className={styles.Container}>
                <div className={styles.Container2}>
					{!Common.IsEmptyObject(Status) && StepIndex === -1 &&
					<div className={styles.Container4}>
						<div className={styles.WhiteSpace1}></div>
						<div className={styles.LabelName}><span>企业名称</span></div>
						<div className={styles.DivTextBox}>
							{this.RenderPropertyItem(this.companyName)}
						</div>
		
						<div className={styles.WhiteSpace3}></div>
						<div className={styles.LabelName}><span>统一企业信用代码</span></div>
						<div className={styles.DivTextBox}>
							{this.RenderPropertyItem(this.buslicenseno)}
						</div>
		
						<div className={styles.WhiteSpace4}></div>
						{isToArtificial && this.RenderPropertyItem(this.buslicense_pic)}
						{isToArtificial &&
						<div className={styles.UploadRemark}><span>请上传jpg、jpeg、png格式照片，大小在10M以内</span></div>}
						<div className={styles.WhiteSpace4}></div>
						<ErrorMessage Property={this.ErrorInfo}/>
		
						{isShowArtificialButton && !isToArtificial && this.RenderPropertyItem(this.ArtificialButton)}
						{isShowArtificialButton && isToArtificial && this.RenderPropertyItem(this.ExitArtificialButton)}
						<div className={styles.WhiteSpace4}></div>
						<div className={styles.WhiteSpace4}></div>
						<div className={styles.WhiteSpace4}></div>
						{this.RenderPropertyItem(this.EnterpriseAuth)}
					</div>
					}
					
					{ !Common.IsEmptyObject(Status) && <AuditStatus StepIndex={StepIndex} GetImageUrl={this.GetImageUrl}
																	RefreshArtificial={this.RefreshArtificial.bind(this)} cbPage={this.GoBack.bind(this)} ResetStatus ={this.ResetStatus.bind(this)}/>}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        EnterpriseOpenAcntProgressQuery: state.UserCenterService.EnterpriseOpenAcntProgressQuery,
        AutoCompanyAppro: state.UserCenterService.AutoCompanyAppro,
        ManualCompanyAppro: state.UserCenterService.ManualCompanyAppro,
        Files: state.FileCenterService.Files,
        UploadFiles: state.FileCenterService.UploadFiles,
        CompanyInfo: state.UserCenterService.CompanyInfo,
		CompanyBasicInfo: state.UserCenterService.CompanyBasicInfo,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_EnterpriseAuth", EnterpriseAuth)));