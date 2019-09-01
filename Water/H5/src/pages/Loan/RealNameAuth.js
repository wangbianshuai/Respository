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

        this.Name = "Loan_RealNameAuth";

        this.Styles = styles;

        this.InitEventAction();

        this.PageConfig.Properties.forEach(p => this[p.Name] = p);

        this.state = {IsToArtificial: false, IsShowArtificialButton: false};

        this.ErrorInfo = {Name: "ErrorInfo"};

        this.Init();
    }

    Init() {

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
	
		document.title = "借款人实名认证";
    }

    componentDidMount() {
        
		const {DoRealnameStatus} = this.ActionTypes;
		this.props.Invoke(DoRealnameStatus);
	
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('借款人实名认证'));
    }
	
	DoRealnameStatus(){
		const {DoRealnameStatus} = this.ActionTypes;
		this.props.Invoke(DoRealnameStatus);
	}

    DoLoanRealname() {
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
        
        const {DoLoanRealname} = this.ActionTypes;
        this.props.Invoke(DoLoanRealname, data);
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
        const {DoLoanRealname, DoRealnameStatus} = this.ActionTypes;
        if (data[DoLoanRealname] !== this.props[DoLoanRealname]) {
            this.ReceiveDoLoanRealName(data[DoLoanRealname]);
            return false;
        }
	
		if (data[DoRealnameStatus] !== this.props[DoRealnameStatus]) {
			this.ReceiveDoRealnameStatus(data[DoRealnameStatus]);
			return false;
		}
		
        return true;
    }

    ReceiveDoLoanRealName(data) {
		if (data.IsSuccess === false) {
			this.SetResponseMessage(data.Message);
			//code = -4 证件号已存在
			if (data.Code === -4 ) {this.ExpandExitArtificial();}
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
	
	ReceiveDoRealnameStatus(data){
		this.GetOpenAccountProgress2(data)
	}

    SetResponseMessage(msg) {
        this.ErrorInfo.Show(msg);
        this.IsLoading = false;
    }

    GetImageUrl(name) {
        return require(`../../assets/${name}`);
    }

    RefreshArtificial() {
		this.ToastLoaing();
		this.DoRealnameStatus();
    }
	
	SetTimeoutRefresh() {
		window.clearTimeout(this.Timer);
		this.Timer = window.setTimeout(() => {
			this.RefreshArtificial();
			this.SetTimeoutRefresh();
		}, 1000 * 60);
	}
	
	componentWillUnmount(){
		window.clearTimeout(this.Timer);
	}
	
	ResetStatus(){
		this.setState({StepIndex: -1});
		this.ExpandExitArtificial()
	}
	
	GetOpenAccountProgress2(data){
		
		if (Common.IsEmptyObject(data) ) return {};
		// StepIndex -1 未认证    StepIndex 0 审核中   StepIndex 1 认证成功      StepIndex 2 认证失败
		const d = {
			StepIndex: -1,
			IsToArtificial: false,
			IsShowArtificialButton: false
		};
		// DoRealnameStatus 接口返回的status状态 0待认证    5第三方无法认证(人工审核)   1认证通过   2认证失败    3认证取消
		
		if (data.IsSuccess === false){
			if (data.Code === -1){
				d.StepIndex = -1;
			}else{
				this.ShowInfo(data.Message);
			}
		}else{
			let res = data.Data ? data.Data : data;
			
			if (res.status === "0"){
				d.StepIndex = 0;
				this.SetTimeoutRefresh();
			}
			else if (res.status === "1"){
				d.StepIndex = 1;
			}
			else if (res.status === "5"){
				d.StepIndex = -1;
				d.IsToArtificial = true;
				d.IsShowArtificialButton = true;
				this.setState({IsToArtificial: true})
				this.setState({IsShowArtificialButton: true})
				
			} else {
				d.StepIndex = 2;
			}
		}
		
		this.setState({StepIndex: d.StepIndex});
		this.StatusData = d;
		// return d
	}
   
    RenderPropertyItem(p) {
        return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
    }

    render() {
        // const Status = this.GetOpenAccountProgress2();
		const {StepIndex} = this.state;
		const Status = this.StatusData;
		const isToArtificial = this.state.IsToArtificial;
        const isShowArtificialButton = this.state.IsShowArtificialButton;
		
        return (
            <div className="Container">
                <div className="Container2">
                    {!Common.IsEmptyObject(Status) && StepIndex === -1 &&
                    <div className='Container4'>
                        <div className='WhiteSpace2'></div>
                        <div className="LabelName"><span>借款人姓名</span></div>
                        <div className="DivTextBox">
                            {this.RenderPropertyItem(this.realName)}
                        </div>
                        <div className="WhiteSpace3"></div>
                        <div className="LabelName"><span>借款人身份证号</span></div>
                        <div className="DivTextBox">
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
                        <div className='WhiteSpace4'></div>
                        <div className='WhiteSpace4'></div>
                        <div className='WhiteSpace4'></div>
                        {this.RenderPropertyItem(this.LoanRealName)}
                    </div>
                    }
                    {!Common.IsEmptyObject(Status) && <AuditStatus StepIndex = {StepIndex} GetImageUrl={this.GetImageUrl} RefreshArtificial={this.RefreshArtificial.bind(this)} ResetStatus ={this.ResetStatus.bind(this)} />}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
		DoRealname: state.UserCenterService.DoRealname,
		DoManualRealname: state.UserCenterService.DoManualRealname,
		DoRealnameStatus: state.UserCenterService.DoRealnameStatus,
        Files: state.FileCenterService.Files,
        UploadFiles: state.FileCenterService.UploadFiles,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_RealNameAuth", RealNameAuth)));