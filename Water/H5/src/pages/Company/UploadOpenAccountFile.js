import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import Components from "Components";
import {EnvConfig, Common} from "UtilsCommon";
import styles from "../../styles/View.scss";
const PropertyItem = Components.PropertyItem;
const ErrorMessage = Components.ErrorMessage;

class UploadOpenAccountFile extends BaseIndex {
	
	constructor(props) {
		super(props);
		
		this.Name = "Company_UploadOpenAccountFile";
		
		this.Styles = styles;
		
		this.InitEventAction();
		
		this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		
		this.state = {};
		
		this.ErrorInfo = {Name: "ErrorInfo"};
		
		document.title = "开户附件资料";
	}
	
	componentDidMount() {
		// this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('开户附件资料'));
		this.Bridge.Js2Native.SetNavigatinBarTitle('开户附件资料');
		//设置显示图片方法，value值为fileid
		// this.yyzz.SetValue('177833')
		const {GetEntityData} = this.ActionTypes;
		this.props.Invoke(GetEntityData)
	}
	
	SubmitEntityData(props) {
		const { Property } = props;
		this.SubmitButtonProperty = Property;
		
		const data = [];
		let msg ='',p = null,item = {};
		const viewProperties = this.PageConfig.Properties.filter((f)=>{
			return f.IsEdit && f.IsVisible !== false
		} );
		for (let i = 0; i < viewProperties.length; i++) {
			p = viewProperties[i];
			if (p.GetValue || p.GetUrlValue){
				if (!p.IsNullable && Common.IsNullOrEmpty(p.GetValue())) {
					msg = p.NullTipMessage || p.Label + "不能为空！";
					break;
				}
				item = {picType:p.Name,fileId:p.GetValue(),fileUrl:p.GetUrlValue()}
				data.push(item);
			}
		}
		
		if (!Common.IsNullOrEmpty(msg)) {
			this.ShowInfo(msg);
			this.SubmitButtonProperty.SetLoading(false);
			return false;
		}
		Property.SetLoading(true);
		const {SaveEntityData} = this.ActionTypes;
		this.props.Invoke(SaveEntityData,data)
	}
	
	ReceiveActionData(data) {
		const {GetEntityData, SaveEntityData} = this.ActionTypes;

		if (data[SaveEntityData] !== this.props[SaveEntityData]) {
			this.ReceiveSubmitEntityData(data[SaveEntityData]);
			return false;
		}
		if (data[GetEntityData] !== this.props[GetEntityData]) {
			this.ReceiveGetEntityData(data[GetEntityData]);
			return false;
		}

		return true;
	}

	ReceiveSubmitEntityData(data) {
		
		this.SubmitButtonProperty.SetLoading(false);
		
		if (data.IsSuccess === false) {
			this.ShowInfo(data.Message);return
		} else {
			this.ShowInfo('提交开户附件材料成功');
			
			window.setTimeout(() => {
				this.ToGoBack();
			}, 500);
			
		}
	}

	ReceiveGetEntityData(data) {
		if (!Common.IsNullOrEmpty(data.files)){
			data.files.forEach((a)=>{
				const name = a.picType;
				const value = a.fileId;
				const url = a.fileUrl;
				this[name].SetValue(value);
				this[name].SetUrlValue(url);
			});

			// const viewProperties = this.PageConfig.Properties.filter((f)=>{
			// 	return f.IsEdit && f.IsVisible !== false
			// } );
			// for (let i = 0; i < viewProperties.length; i++) {
			// 	p = viewProperties[i];
			// 	// console.log(p)
			// 	// p.SetValue(data[p.Name]);
			// 	// p.SetUrlValue(data[p.Name]);
			// }
		}
	}
	
	SetResponseMessage(msg) {
		this.ErrorInfo.Show(msg);
		this.IsLoading = false;
	}
	
	RenderPropertyItem(p) {
		return <PropertyItem Property={p} View={this.PageConfig} EventActions={this.EventActions}/>
	}
	
	render() {
		return (
			<div className="Container">
				<div className="Container2">
					<div className="UploadOpenAccountFile">
						<div className="WhiteSpace1"></div>
						<div className="WhiteSpace2"></div>
						<div className="SpanTitle2"><span>上传开户附件:</span></div>
						
						<div className="uploadFileWrap">
							<div className="uploadFileBox">
								<p className="uploadLabel">营业执照</p>
								{this.RenderPropertyItem(this.yyzz)}
							</div>
							<div className="uploadFileBox">
								<p className="uploadLabel">开户许可证</p>
								{this.RenderPropertyItem(this.khxkz)}
								<p className="UploadRemark">一般户也是上传 <br/>开户许可证</p>
							</div>
							<div className="uploadFileBox">
								<p className="uploadLabel">法人身份证</p>
								{this.RenderPropertyItem(this.frsfz)}
								<p className="UploadRemark">手持身份证正面</p>
							</div>
						</div>
						<ErrorMessage Property={this.ErrorInfo}/>
						<div className="WhiteSpace2"></div>
						<p className="UploadRemark">提示：三个都为必填，上传附件不大于3M，格式为JPG、JPEG</p>
						{this.RenderPropertyItem(this.SubmitButton)}
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, ownProps) {
	const props = StaticIndex.MapStateToProps(state, ownProps, {
		GetCompanyUploadFiles: state.UserCenterService.CompanyUploadFiles,
		SaveCompanyUploadFiles: state.UserCenterService.SaveCompanyUploadFiles,
	});
	
	!EnvConfig.IsProd && console.log(props);
	return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_UploadOpenAccountFile", UploadOpenAccountFile)));
