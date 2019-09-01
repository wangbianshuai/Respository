import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";
const PropertyItem = Components.PropertyItem;

class CarInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_CarInfo";

        this.InitEventAction();
	
		document.title = "借款人车产信息";
    }

    componentDidMount() {
		this.Bridge.Js2Native.InitInvoke(() => this.Bridge.Js2Native.SetNavigatinBarTitle('借款人车产信息'));
	
		this.PageConfig.Properties.forEach(a => {
			if (a.Name === "AddCar") this.AddCarProperty = a;
		});
		
        this.PageConfig.EventActions.forEach(a => {
            if (a.Name === "AddCar") a.ExpandAdd = this.ExpandDataListViewAdd.bind(this);
            else if (a.Name === "DeleteCar") a.ExpandRemove = this.ExpandDataListViewRemove.bind(this);
        })
	
		this.PageConfig.ExpandGetEntity = this.ExpandDataListViewGetEntity.bind(this);
		this.DataListViewAddSaveStatus = false;
    }

    ExpandDataListViewAdd(props, action) {
        const { DataListView } = action.Parameters;
		
        const dataList = DataListView.GetValue();
        
        const title = DataListView.Title;
		
		if (dataList.length >= 4) {this.AddCarProperty.SetVisible(false)}
		else{this.AddCarProperty.SetVisible(true)}
		
        if (dataList.length >= 5) { this.Alert(`对不起，最多只能新建5个${title}！`); return; }

        const len = this.GetLenName(dataList.length);

        const data = { Id: Common.CreateGuid(), Title: `${title}${len}` }

        // DataListView.Add(data)
		//新增前判断是否有新增但未保存的,新增未保存的，当前项不存在id
		//根据id判断是否是新增，然后再判断新增列是否有值
		let list  = dataList.filter((f)=>{
			return !f.id
		});
	
		if(list.length>0 && (list[0].numberPlate || list[0].carType || list[0].ower || list[0].owerHomeAddress || list[0].useType || list[0].brandModel || list[0].vehicleId || list[0].engineId || list[0].registrationDate || list[0].issueDate) ){
			const CarList = {CarList:dataList};
			const obj = {
				EntityData:CarList
			};
		
			this.DataListViewAddSaveStatus = true;
		
			this.DataListViewAddItem = {
				DataListView:DataListView,
				data:data
			};
		
			const { SaveCarInfo } = this.ActionTypes;
			this.props.Invoke(SaveCarInfo,obj);
		}else{
			DataListView.Add(data);
		}
    }

    GetLenName(len) {
        if (len === 0) return "一";
        else if (len === 1) return "二";
        else if (len === 2) return "三";
        else if (len === 3) return "四";
        else if (len === 4) return "五";

        return len + 1;
    }
	
	ExpandDataListViewGetEntity(data,props, action){
		//首次进入判断是否已经有5条
		if (data.CarList && data.CarList.length >= 5){
			this.AddCarProperty.SetVisible(false)
		}
		
		// 新增时保存上一个之后的回调
		if (this.DataListViewAddSaveStatus) {
			
			this.DataListViewAddItem.DataListView.Add(this.DataListViewAddItem.data);
			
			this.DataListViewAddSaveStatus = false;
			
		}
	}

	//代码优化待处理
    ExpandDataListViewRemove(props, action) {
        const { DataListView } = action.Parameters;
        const title = DataListView.Title;
	
		const dataList = DataListView.GetValue();
		
		
        const list = DataListView.GetValue().filter((f)=>{
			 return f.Id !== props.Property.DataId
		});
        
		const list2 = DataListView.GetValue().filter((f)=>{
			return f.Id === props.Property.DataId
		});
		
        if (list2[0].id){
			if (Common.IsNullOrEmpty(list2[0].numberPlate) && Common.IsNullOrEmpty(list2[0].carType) && Common.IsNullOrEmpty(list2[0].ower) && Common.IsNullOrEmpty(list2[0].owerHomeAddress) && Common.IsNullOrEmpty(list2[0].useType) && Common.IsNullOrEmpty(list2[0].brandModel) && Common.IsNullOrEmpty(list2[0].vehicleId) && Common.IsNullOrEmpty(list2[0].engineId) && Common.IsNullOrEmpty(list2[0].registrationDate) && Common.IsNullOrEmpty(list2[0].issueDate)){
				
				if (dataList.length <= 5) {this.AddCarProperty.SetVisible(true)}
				else{this.AddCarProperty.SetVisible(false)}
				
				const { RemoveCarInfo } = this.ActionTypes;
				this.props.Invoke(RemoveCarInfo, list2[0]);
			}else{
				this.Confirm('确认直接删除此项车产信息吗？',()=> {
					
					if (dataList.length <= 5) {this.AddCarProperty.SetVisible(true)}
					else{this.AddCarProperty.SetVisible(false)}
					
					const { RemoveCarInfo } = this.ActionTypes;
					this.props.Invoke(RemoveCarInfo, list2[0]);
				})
			}
			
		}else{
			if (list2[0].numberPlate || list2[0].carType || list2[0].ower || list2[0].owerHomeAddress || list2[0].useType || list2[0].brandModel || list2[0].vehicleId || list2[0].engineId || list2[0].registrationDate || list2[0].issueDate){
				
				this.Confirm('确认直接删除此项车产信息吗？',()=> {
					if (dataList.length <= 5) {this.AddCarProperty.SetVisible(true)}
					else{this.AddCarProperty.SetVisible(false)}
					
					list.forEach((d, i) => {
						const len = this.GetLenName(i);
						d.Title = `${title}${len}`
					});
					
					DataListView.SetValue(list);
				})
				
			}else{
				if (dataList.length <= 5) {this.AddCarProperty.SetVisible(true)}
				else{this.AddCarProperty.SetVisible(false)}
				
				list.forEach((d, i) => {
					const len = this.GetLenName(i);
					d.Title = `${title}${len}`
				});
				
				DataListView.SetValue(list);
			}
			
		}
    }
	
	ReceiveRemoveCarInfo(data){
		if (data.IsSuccess === false) this.ShowInfo(data.Message);
		else {
			this.AlertSuccess(data.Data.message);
			
			window.setTimeout(() => {
				const { GetCarInfo } = this.ActionTypes;
				this.props.Invoke(GetCarInfo);
			}, 500);
			
		}
	}

    render() {
        return (
        	<div>
				<div className="WhiteSpace2"></div>
				<PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
			</div>
		)
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
		LoanCarInfo:state.UserCenterService.LoanCarInfo,
		SaveLoanCarInfo:state.UserCenterService.SaveLoanCarInfo,
		RemoveLoanCarInfo:state.UserCenterService.RemoveLoanCarInfo,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Loan_CarInfo", CarInfo)));