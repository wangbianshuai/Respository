import React from "react";
import {connect} from "dva";
import {BaseIndex, RootPage, ConnectAction, StaticIndex} from "ReactCommon";
import {EnvConfig , Common} from "UtilsCommon";
import Components from "Components";
const PropertyItem = Components.PropertyItem;

class BasicInfo extends BaseIndex {
    constructor(props) {
        super(props);
        this.Name = "Company_BasicInfo";

        this.InitEventAction();

        this.PageConfig.Properties.forEach(p => this[p.Name] = p);
		document.title = "企业基本信息";
    }

    componentDidMount() {
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('企业基本信息'));
		
        const { GetCompanyInfo, GetIndustryLeveOne } = this.ActionTypes;
        
        this.props.Invoke(GetCompanyInfo);
		
        this.props.Invoke(GetIndustryLeveOne);
        
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.Properties.forEach(p => {
            if (p.Name === "companyIndustry") { p.IsLoadValue = true; this.CompanyTypeProperty = p;  p.ValueChange = this.CompanyTypeChange.bind(this);}
            else if (p.Name === "industryBigType") { p.IsLoadValue = true; this.IndustryBigTypeProperty = p; p.ValueChange = this.IndustryBigTypeChange.bind(this); }
            else if (p.Name === "industryMiddleType") { p.IsLoadValue = true; this.IndustryMiddleTypeProperty = p;  p.ValueChange = this.IndustryMiddleTypeChange.bind(this);}
            else if (p.Name === "industryMinimumType") this.IndustryMinimumTypeProperty = p;
            else if (p.Name === "companyAddrOwnerShip") {
                p.ValueChange = this.CompanyAddrOwnerShipChange.bind(this);
                p.IsLoadValue = true;
            }
            else if (p.Name === "companyAddrTimeLimitStart") this.CompanyAddrTimeLimitStartProperty = p;
            else if (p.Name === "companyAddrTimeLimitEnd") this.CompanyAddrTimeLimitEndProperty = p;
        });
    }

    //接受数据
    ReceiveActionData(data) {
        const {GetCompanyInfo,SetIndustry, SaveCompanyInfo, GetIndustryLeveOne, GetIndustryLeveTwo, GetIndustryLeveThree, GetIndustryLeveFour} = this.ActionTypes;
		
        if (data[GetCompanyInfo] !== this.props[GetCompanyInfo]) {
            this.ReceiveUserCompanyInfo(data[GetCompanyInfo]);
            return false;
        }
        if (data[SaveCompanyInfo] !== this.props[SaveCompanyInfo]) {
            this.ReceiveSaveCompanyInfo(data[SaveCompanyInfo]);
            return false;
        }

        if (data[SetIndustry] !== this.props[SetIndustry]) { this.ReceiveSetIndustry(data[SetIndustry]); return false; }
		if (data[GetIndustryLeveOne] !== this.props[GetIndustryLeveOne]) { this.ReceiveGetIndustryLeveOne(data[GetIndustryLeveOne]); return false; }
		if (data[GetIndustryLeveTwo] !== this.props[GetIndustryLeveTwo]) { this.ReceiveGetIndustryLeveTwo(data[GetIndustryLeveTwo]); return false; }
		if (data[GetIndustryLeveThree] !== this.props[GetIndustryLeveThree]) { this.ReceiveGetIndustryLeveThree(data[GetIndustryLeveThree]); return false; }
		if (data[GetIndustryLeveFour] !== this.props[GetIndustryLeveFour]) { this.ReceiveGetIndustryLeveFour(data[GetIndustryLeveFour]); return false; }
        return true;
    }


    ReceiveUserCompanyInfo(data) {
        if (data.IsSuccess === false) this.ShowInfo(data.Message);
        else {
            this.PageConfig.Properties.forEach(p => {
                if (data[p.Name]){
					if (this[p.Name].SetValue)this[p.Name].SetValue(data[p.Name]);
					else this[p.Name].Value = data[p.Name];
				}
            });
        }
    }

    ReceiveSaveCompanyInfo(data) {
		this.IsLoading = false;
        if (data.IsSuccess === false) {
        	this.ShowInfo(data.Message);
		}
        else {
			this.AlertSuccess('保存成功');
        }
    }
	
	ReceiveGetIndustryLeveOne(data){
		data.forEach(d => d.id = d.key);
		this.SetSelectDataSource(this.CompanyTypeProperty, data);
	}
	
	ReceiveGetIndustryLeveTwo(data){
		const parentValue = this.CompanyTypeProperty.GetValue();
		data.forEach(d => {d.id = d.key; d.parentId = parentValue});
		this.SetSelectDataSource(this.IndustryBigTypeProperty, data, parentValue);
	}
	
	ReceiveGetIndustryLeveThree(data){
		const parentValue = this.IndustryBigTypeProperty.GetValue();
		data.forEach(d => {d.id = d.key; d.parentId = parentValue});
		this.SetSelectDataSource(this.IndustryMiddleTypeProperty, data, parentValue);
	}
	
	ReceiveGetIndustryLeveFour(data){
		const parentValue = this.IndustryMiddleTypeProperty.GetValue();
		
		data.forEach(d => {d.id = d.key; d.parentId = parentValue});
		this.SetSelectDataSource(this.IndustryMinimumTypeProperty, data, parentValue);
	}
	
	CompanyTypeChange(value){
		const { GetIndustryLeveTwo } = this.ActionTypes;
		this.props.Invoke(GetIndustryLeveTwo,value);
	}
	
	IndustryBigTypeChange(value){
		const { GetIndustryLeveThree } = this.ActionTypes;
		this.props.Invoke(GetIndustryLeveThree,value);
	}
	
	IndustryMiddleTypeChange(value){
		const { GetIndustryLeveFour } = this.ActionTypes;
		this.props.Invoke(GetIndustryLeveFour,value);
	}
	
	
	ReceiveSetIndustry(data) {
		this.ReceiveGetIndustryLeveOne(data)
    }

    SetSelectDataSource(p, dataList, parentValue) {
        if (p.SetDataSource) p.SetDataSource(dataList, parentValue)
        else p.DataSource = dataList;
    }
	
    CompanyAddrOwnerShipChange(value) {
        if (!this.CompanyAddrTimeLimitStartProperty) return;
        const isVisible = Common.IsEquals(value, '01');
        this.CompanyAddrTimeLimitStartProperty.SetVisible(isVisible);
        this.CompanyAddrTimeLimitEndProperty.SetVisible(isVisible);
        if (!isVisible) {
            this.CompanyAddrTimeLimitStartProperty.SetValue("");
            this.CompanyAddrTimeLimitEndProperty.SetValue("");
        }
    }

    SaveCompanyInfo() {
        if (this.IsLoading) return;
        this.IsLoading = true;

        const data = {};
		const viewProperties = this.PageConfig.Properties.filter((f)=>{
			return f.IsEdit && f.IsVisible !== false
		} );
		
		viewProperties.forEach(p => {
            if (p.GetValue && !Common.IsNullOrEmpty(p.GetValue())) {
            	if (p.Name === 'registerCapital') data[p.Name] = Number(p.GetValue());
            	else data[p.Name] = p.GetValue()
			}
        });
        const {SaveCompanyInfo} = this.ActionTypes;
        this.props.Invoke(SaveCompanyInfo, data);
    }


    render() {

        return <PropertyItem Property={this.PageConfig} EventActions={this.EventActions}/>
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
		SaveCompanyBasicInfo: state.UserCenterService.SaveCompanyBasicInfo,
		CompanyBasicInfo: state.UserCenterService.CompanyBasicInfo,
		GetIndustryLeveOne:state.UserCenterService.IndustryLeveOne,
		GetIndustryLeveTwo:state.UserCenterService.IndustryLeveTwo,
		GetIndustryLeveThree:state.UserCenterService.IndustryLeveThree,
		GetIndustryLeveFour:state.UserCenterService.IndustryLeveFour,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Company_BasicInfo", BasicInfo)));
