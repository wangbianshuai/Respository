import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig, Common} from "UtilsCommon";
import {Button} from "antd-mobile"

class OpenAccountResult extends BaseIndex {
	
	constructor(props) {
		super(props);
		
		this.Name = "User_OpenAccountResult";
		
		this.InitEventAction();
		
		this.state = {
			status: '1',
			errorTitle: '开户失败',
			errorMsg: '',
			successTitle: '开户成功',
			successMsg: ''
		};
		
		document.title = "存管开户";
		
	}
	
	componentDidMount() {
		
		this.getParmes();
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('存管开户'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('存管开户')
	}
	
	
	getParmes(){
		// status = 1 开户成功，loginId  成功显示loginId，
		// status = 0  开户失败，errorMsg  失败原因，
		const status = Common.GetQueryValue('status');
		const loginId = Common.GetQueryValue('loginId');
		const successMsg = Common.GetQueryValue('successMsg');
		const errorTitle = Common.GetQueryValue('errorTitle');
		const errorMsg = Common.GetQueryValue('errorMsg');
		
		this.setState({
			status:status,
			errorTitle:errorTitle,
			errorMsg:errorMsg,
			successMsg:successMsg,
			loginId:loginId
		})
	}
	
	JulpToOpenAccountStatus(){
		this.Bridge.Js2Native.ToPop(0,3);
		// this.Bridge.Js2Native.OpenAccountResult();
	}
	
	render() {
		let {status, errorMsg, errorTitle, successTitle, successMsg} = this.state;
		
		if(status === undefined) {
			if(!successTitle && !successMsg && !errorTitle && !errorMsg) {
				return (<div className="OpenAccountBoxWrap"> </div>)
			}
			status = successTitle || successMsg ? '1':'0'
		}
		
		return (
			<div className="OpenAccountBoxWrap">
				<div className="OpenAccountBox">
					{status && status === '1' &&
					<div className="openAccountResult">
						<div className="openaccount-result-top success-bg">
							<div className="manage-organization">
								<p>资金存管机构</p>
								<p>华瑞银行股份有限公司（简称：华瑞银行）</p>
							</div>
							<div className="circle-box">
								<span className="result-txt">{successTitle}</span>
							</div>
							<div className="wave-bg"></div>
						</div>
						<p className='openaccount-result-txt success-txt'>{successTitle}</p>
						<div className="fail-tips block">{successMsg}</div>
						{/*<div className="fail-tips block">存管账户登录用户名为手机号{loginId}</div>*/}
						<div className="div-btn success-btn block">
							<Button onClick={this.JulpToOpenAccountStatus.bind(this)} className="JulpToOpenAccountStatus" type="primary">完成</Button>
						</div>
					</div>
					}
					{status && status === '0' &&
					<div className="openAccountResult">
						<div className="openaccount-result-top fail-bg">
							<div className="manage-organization">
								<p>资金存管机构</p>
								<p>华瑞银行股份有限公司（简称：华瑞银行）</p>
							</div>
							<div className="circle-box">
								<span className="result-txt">开户失败</span>
							</div>
							<div className="wave-bg"></div>
						</div>
						<p className='openaccount-result-txt fail-txt'>{errorTitle}</p>
						<div className="fail-tips block">{errorMsg}</div>
						<div className="div-btn success-btn block">
							<Button onClick={this.JulpToOpenAccountStatus.bind(this)}  className="JulpToOpenAccountStatus" type="primary">返回</Button>
						</div>
					</div>
					}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		UserInfo: state.ApiH5Service.UserInfo,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}
//UserInfo 用户基本信息获取用户开户状态；UserAccount用户已开户的基本信息；UserRealName开户前实名认证 FuyouJump获取跳转富友的参数
export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("User_OpenAccountResult", OpenAccountResult)));
