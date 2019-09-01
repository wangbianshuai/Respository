import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import Components from "Components";
import { EnvConfig, Common} from "UtilsCommon";
import styles from "../../styles/View.scss";
// import JsBridge from "JsBridge";
const PropertyItem = Components.PropertyItem;

//征信授权
class CreditAuth extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Loan_CreditAuth";
		
		this.Styles = styles;
		
		this.InitEventAction();
		
		this.Init();
		
		this.state = {AuthStatus: false,phoneNum:'',loanApplyId:'',userId:'UR151825247077662720'}
	}
	
	Init(){
		
		document.title = "借款及征信授权";
		
		this.ConfirmButton = {
			Name: "ConfirmButton",
			Text: "确认授权",
			Type: "Button",
			ButtonType: "primary",
			EventActionName: 'ConfirmCreditAuth'
		};
		this.HadConfirmButton = {
			Name: "HadConfirmButton",
			Text: "已授权",
			Type: "Button",
			Disabled:true,
			ButtonType: "primary",
			EventActionName: ''
		};
	}
	
	componentDidMount() {
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('借款及征信授权'));
		
		this.VerifyCodeView = this.PageConfig.DialogViews[0];
		this.VerifyCodeProperties = this.VerifyCodeView.Properties[0];
		
		let data = {
			"loanApplyId": "",
			"userId": this.state.userId,
			"data": {}
		};
		const loanApplyId = Common.GetQueryValue('applyId');
		const phoneNum = Common.GetQueryValue('phoneNum');
		data.loanApplyId = loanApplyId;
		this.setState({
			phoneNum,
			loanApplyId
		});
		//修改title
		this.VerifyCodeView.DialogTitle = '手机号：'+phoneNum;
		
		const { QueryCreditAuthorize } = this.ActionTypes;
		this.props.Invoke(QueryCreditAuthorize,data);
	}
	
	ConfirmCreditAuth(res){
		const props = {
			EventActions: this.EventActions,
			EditData: { "loanApplyId": this.state.loanApplyId, "userId": this.state.userId,"data": {}}
		};
		this.EventActions.InvokeAction("ShowVerifyCode", props);
	}
	
	SendVerifyCode(props,action){
		if (this.IsLoading) return;
		this.IsLoading = true;
		let data = {
			"loanApplyId": this.state.loanApplyId,
			"userId": this.state.userId,
			"data": {}
		};
		const {sendCreditAuthorizeSms} = this.ActionTypes;
		this.props.Invoke(sendCreditAuthorizeSms,data);
	}
	
	OkConfirmCreditAuth(props,action){
		const { Property } = props;
		this.DialogProperty = Property;
		
		if (Common.IsNullOrEmpty(this.VerifyCodeProperties.GetValue())){
			this.ShowInfo('请输入验证码');
			return;
		}
		const data = {
			"loanApplyId": this.state.loanApplyId,
			"userId": this.state.userId,
			"commonUsePhone":this.state.phoneNum,
			"smsVerificationCode":this.VerifyCodeProperties.GetValue(),
			"data": {}
		};
		
		Property.SetLoading(true);
		const {creditAuthorize} = this.ActionTypes;
		this.props.Invoke(creditAuthorize,data);
	}
	
	ReceiveActionData(data){
		const {sendCreditAuthorizeSms, QueryCreditAuthorize, creditAuthorize} = this.ActionTypes;
		if (data[sendCreditAuthorizeSms] !== this.props[sendCreditAuthorizeSms]) {
			this.ReceiveSendVerifyCode(data[sendCreditAuthorizeSms]);
			return false;
		}
		if (data[QueryCreditAuthorize] !== this.props[QueryCreditAuthorize]) {
			this.ReceiveQueryCreditAuthorize(data[QueryCreditAuthorize]);
			return false;
		}
		if (data[creditAuthorize] !== this.props[creditAuthorize]) {
			this.ReceiveCreditAuthorize(data[creditAuthorize]);
			return false;
		}
		return true;
	}
	
	ReceiveQueryCreditAuthorize(data){
		this.IsLoading = false;
		if (data.IsSuccess === false) this.ShowInfo(data.Message);
		else{
			if (data.isauthorized === '02') this.setState({AuthStatus:false});
			if (data.isauthorized === '01') this.setState({AuthStatus:true});
			else{
				this.setState({AuthStatus:false});
			}
		}
	}

	ReceiveSendVerifyCode(data){
		this.IsLoading = false;
		if (data.IsSuccess === false) {
			this.ShowInfo(data.Message);
		}
		else{
			this.ShowInfo('发送成功');
			this.VerifyCodeProperties.ShowSecondCount();
		}
	}
	
	ReceiveCreditAuthorize(data){
		this.IsLoading = false;
		this.DialogProperty.SetLoading(false);
		if (data.IsSuccess === false) {
			this.ShowInfo(data.Message);
		}
		else {
			this.ShowInfo('授权成功');
			
			this.DialogProperty.SetVisible(false);
			
			this.setState({
				AuthStatus: true
			});
			
		}
	}
	
	RenderPropertyItem(p) {
		return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
	}
	
	
	
	render(){
		return(
			<div className="Container">
				<div className="Container2">
					<div className="CreditAuthBox">
						<div className="WhiteSpace1"></div>
						<div className="CreditAuthContentTitle">借款业务及征信查询授权书</div>
						<div className="main">
							<p className="CreditAuthContent">
								在本人/本公司（以下统称“本人”）向新新贷（上海）金融信息服务有限公司（下称“新新贷”）运营的新新贷平台（www.xinxindai.com）申请借款业务的过程中，基于交易条件评估、风险评估、控制及风险管理等用途，及健全、完善本人信用状况的目的，在充分了解、知悉相关条款的前提下，本人同意向新新贷出具本《借款业务及征信查询授权书》（以下简称“《授权书》”），自愿且不可撤销地作出如下确认及独立授权：
							</p>
							<p className="CreditAuthContent">
								一、本人已充分知悉并确认，通过新新贷平台申请借款，为本人真实意思表示；用于新新贷平台及各类APP上申请借款所注册的手机号，均为本人或经本人充分授权的代理人所有。本人已知悉，该手机号将用于如账户注册、填写及完善资料、接收手机验证短信、生成电子签章手机验证短信、生成电子签章、申请借款等线上借款相关操作事项。本人将妥善保管相关登录信息，对于经由该手机号或账号进行的上述一切操作，包括电子签章行为及通过签署的电子合同，均视为本人亲自操作、本人均予以承认和认可，因上述行为引起的法律后果，均由本人承担。
							</p>
							<p className="CreditAuthContent">
								二、本人同意并授权新新贷向合法拥有本人信息的相关机构（包括但不限于中国人民银行金融信用信息基础数据库以及经国务院或其他政府有权部门批准合法设立的征信机构、中国互联网金融协会以及其他相关机构）查询、报送本人信用信息（包括但不限于收入、存款、有价证券、商业保险、不动产和纳税信息等），查询或报送的信用信息包括但不限于负债信息及偿债履约能力判断信息；
							</p>
							<p className="CreditAuthContent">
								三、本人同意并授权新新贷就采集本人的信息，对其进行整理、保存、分析、比对、核实、校验、加工、使用。为了持续健全、完善本人的信用状况，本人同意并授权新新贷可在不另行获得本人专门授权的前提下，向上述相关机构对本人的信息进行补充、更新与修改；本人同时承诺，在审核过程中如遇前款信息发生变更，将及时通知新新贷；因本人未能及时告知信息变更所造成的法律后果，均由本人承担。
							</p>
							<p className="CreditAuthContent">
								四、本人已经理解并知悉，新新贷将对采集到的信息进行独立的风控分析，并可能基于该等信息对本人的资信情况作出负面性评价。本人同意并授权新新贷充分采集本人的个人不良信息，并对新新贷基于该等不良信息所作出的任何判断、决定、结论（包括但不限于因相关审核资质决定对本人的借款申请不予受理的）均予以接受；
							</p>
							<p className="CreditAuthContent">
								五、本人如与新新贷在履行本授权过程中发生任何争议，本人同意将争议提交本《授权书》签订地所在的上海市虹口区人民法院诉讼解决；
							</p>
							<p className="CreditAuthContent">
								六、本人已知悉本《授权书》所有内容的意义以及由此产生的法律效力，自愿作出上述授权，授权期限自本人进行确认动作（包括授权进行电子签名或点击确认同意等动作）之日起，至本人于新新贷平台申请的业务完全清偿或结束之日止。本《授权书》是本人真实的意思表示，本人同意承担由此带来的一切法律后果。
							</p>
							<p className="CreditAuthContent">
								特此授权！
							</p>
						</div>
						
						<div className="button-wrap">
							{!this.state.AuthStatus && this.RenderPropertyItem (this.ConfirmButton)}
							{this.state.AuthStatus && this.RenderPropertyItem (this.HadConfirmButton)}
						</div>
						
					</div>
				</div>
			</div>
		)
		
	}
}


function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		QueryCreditAuthorize:state.RiskControlApprovalService.QueryCreditAuthorize,
		sendCreditAuthorizeSms:state.RiskControlApprovalService.sendCreditAuthorizeSms,
		creditAuthorize:state.RiskControlApprovalService.creditAuthorize,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_CreditAuth", CreditAuth)));



