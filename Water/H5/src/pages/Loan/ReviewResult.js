import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import Components from "Components";
import { EnvConfig, Common} from "UtilsCommon";
import styles from "../../styles/View.scss";
const PropertyItem = Components.PropertyItem;


class ReviewResult extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Loan_ReviewResult";
		
		this.Styles = styles;
		
		this.InitEventAction();
		
		this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		
		this.state = {
			EntityData: {},
			ResultStatus: true,
			setIsApply:true,
			ReviewId:'',
			showRemark:false
		}
		
		document.title = "网查复核";
		
		this.AuditStatusBoxClassName = 'applyAuditStatusBox'
	}
	
	componentDidMount(){
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('网查复核'));
		
		const { GetResult } = this.ActionTypes;
		this.props.Invoke(GetResult);
	}
	
	ReceiveActionData(data){
		const {GetResult, ApplyEntityData} = this.ActionTypes;

		if (data[GetResult] !== this.props[GetResult]) {
			this.ReceiveGetResult(data[GetResult]);
			return false;
		}
		if (data[ApplyEntityData] !== this.props[ApplyEntityData]) {
			this.ReceiveApplyEntityData(data[ApplyEntityData]);
			return false;
		}
		return true;
	}
	
	ReceiveGetResult(data){
		if (data.IsSuccess === false) {
			if (data.Code === "100500")this.ShowInfo('未提交前置网查');
			else this.ShowInfo(data.Message);
		}
		else {
			let Result = data;
			
			this.setState({EntityData:Result});
			this.setState({ReviewId:Result.id});
			
			Result.status === 'passed' ? this.setState({ResultStatus:true}) :this.setState({ResultStatus:false});
			if (Result.isApply === '1') this.setState({setIsApply:true});
			if (Result.isApply === '0') this.setState({setIsApply:false});
			if (Result.applyAuditStatusStr === '未通过'||Result.applyAuditStatusStr === '已通过' ) this.setState({showRemark:true});
			if (Result.isApply === '1' && Result.applyAuditStatusStr === '待审核') this.WaitReviewStatus();
			
			if (Result.status === 'passed' || Result.applyAuditStatusStr === '已通过'){
				this.AuditStatusBoxClassName = 'applyAuditStatusBox passedColor'
			}
			this.PageConfig.Properties.map((m) => {
				return m.Value = Result[m.Name]
			});
		}
	}
	
	ReceiveApplyEntityData(data){
		// console.log(data);
		this.IsLoading = false;
		if (data.IsSuccess === false) {
			this.ShowInfo(data.Message);
			return;
		}else{
			this.AlertSuccess('已提交复核申请！');
			
			window.setTimeout(() => {
				this.Bridge.Js2Native.ToPop(0,3);
			}, 500);
		}
	}
	
	ApplyEntityData(){
		if (this.IsLoading) return;
		this.IsLoading = true;
		let usercode = Common.GetStorage('LoanUserCode');
		// if (usercode === undefined) usercode = Common.GetQueryValue('usercode');
		const data = {
			wcId:this.state.ReviewId,
			usercode:usercode
		};
		this.PageConfig.Properties.forEach(p => {
			if(p.Name === "reason" && p.GetValue)
				data[p.Name] = p.GetValue();
		});
		
		let msg ='';
		if (Common.IsNullOrEmpty(data.reason)) msg = "请输入复核原因";
		if(msg) {
			this.ShowInfo(msg);
			this.IsLoading = false;
			return;
		}
		console.log(data);
		const { ApplyEntityData } = this.ActionTypes;
		this.props.Invoke(ApplyEntityData,data);
	}
	
	WaitReviewStatus(){
		this.ShowInfo('已提交复核申请，等待风控人员审核。');
	}
	
	RenderPropertyItem(p) {
		return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
	}
	
	render(){
		const {ResultStatus, setIsApply,showRemark } = this.state;
		
		return(
			<div className="Container2">
				<div className="c-openaccount-main ReviewReasonBox">
					<div className="WhiteSpace2"></div>
					<div className="WhiteSpace3"></div>
					
					{this.RenderPropertyItem(this.name)}
					
					{this.RenderPropertyItem(this.moblie)}
					
					{this.RenderPropertyItem(this.idNumber)}
					
					<div className={this.AuditStatusBoxClassName}>
						{!setIsApply && this.RenderPropertyItem(this.statusStr)}
					</div>
					<div className={this.AuditStatusBoxClassName}>
						{setIsApply && this.RenderPropertyItem(this.applyAuditStatusStr)}
					</div>
					
					{showRemark && this.RenderPropertyItem(this.auditRemark)}
					{showRemark && this.RenderPropertyItem(this.auditEffectiveTime)}
				</div>
				<div className="WhiteSpace1"></div>
				<div className="c-openaccount-main ReviewReasonWrap">
					{/*未通过，并且为未提交复核状态*/}
					{!ResultStatus && !setIsApply && this.RenderPropertyItem(this.reason)}
				</div>
				
				<div className="WhiteSpace1"></div>
				{/*未通过，并且为未提交复核状态*/}
				{!ResultStatus && !setIsApply &&  this.RenderPropertyItem(this.ApplyEloanQuery)}
				
				
			</div>
		)
			
	}
}


function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		QzwcResult:state.UserCenterService.QzwcResult,
		ApplyQzwcResult:state.UserCenterService.ApplyQzwcResult,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_ReviewResult", ReviewResult)));


