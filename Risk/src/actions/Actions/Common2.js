import { Common } from "UtilsCommon";
import EnumMap from "./EnumMap";

export default class Common2 {

    //获取工单基本信息
    static GetOrderInfoEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderDetailEntityData", { ...data.EntityData, type: "01", Action: this.GetAction(id, actionType) });
    }

    static GetOrderInfoEntityData2(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderDetailEntityData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    static SetGetOrderInfoEntityData(id, actionType, data) {
        data = Common2.SetGetOrderDetailEntityData.call(this, id, actionType, data);

        if (data.loanApplyBaseInfo) return data.loanApplyBaseInfo;

        return data;
    }

    static GetOrderDetailEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderDetailEntityData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    static SetGetOrderDetailEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (!data.carPropertyList || data.carPropertyList.length === 0) data.carPropertyList = [{ Id: Common.CreateGuid(), Title: "车产信息一" }];
        else data.carPropertyList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "车产" + Common2.GetLenName(i); });

        if (!data.realEstateList || data.realEstateList.length === 0) data.realEstateList = [{ Id: Common.CreateGuid(), Title: "房产信息一" }];
        else data.realEstateList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "房产" + Common2.GetLenName(i); });

        data.PersonPropertyInfo = {
            CarList: data.carPropertyList,
            HouseList: data.realEstateList
        };

        if (data.personalIdentity) {
            const entityData = data.personalIdentity;
            entityData.Period = Common2.JoinTwoValues(entityData.validityStartDate, entityData.validityEndDate, " - ", true);
            entityData.genderName = EnumMap.GetSexName(entityData.gender);
            entityData.nationalityName = EnumMap.GetNationalityName(entityData.nationality)
        }

        if (data.personalBase) {
            const entityData = data.personalBase;
            entityData.HousePeriod = Common2.JoinTwoValues(entityData.leaseStartPeriod, entityData.leaseEndPeriod, " - ", true);
        }

        if (data.enterprise) {
            const entityData = data.enterprise;
            entityData.CompanyHousePeriod = Common2.JoinTwoValues(entityData.leaseStartPeriod, entityData.leaseEndPeriod, " - ", true);
        }

        if (data.loanApplyBaseInfo) {
            const { lenderProvincecode, lenderProvincename, lenderCitycode, lenderCityname, loanUsefor,
                productCategory, productShortName, loanSellerName, loanSellerDepartment, repayWay,
                loanApplyChannel, lenderType, loanApplyPeriod, loanApplyPeriodUnit } = data.loanApplyBaseInfo;

            const list = [], list2 = [];
            if (lenderProvincecode) {
                list.push(lenderProvincecode);
                list2.push(lenderProvincename);
                if (lenderCitycode) {
                    list.push(lenderCitycode);
                    list2.push(lenderCityname);
                }
            }
            data.loanApplyBaseInfo.lenderProvinceCity = list;
            data.loanApplyBaseInfo.lenderProvinceCityName = list2.join("/");

            const productCategoryName = EnumMap.GetProductCategoryName(productCategory);
            data.loanApplyBaseInfo.productType = `${productCategoryName}（${productShortName}）`;

            data.loanApplyBaseInfo.loanUser = `${loanSellerName}/${loanSellerDepartment}`;

            data.loanApplyBaseInfo.loanApplyChannelName = EnumMap.GetLoanApplyChannelName(loanApplyChannel);

            data.loanApplyBaseInfo.lenderTypeName = EnumMap.GetLenderTypeName(lenderType);

            data.AttachmentInfo = { isspecial: data.loanApplyBaseInfo.isspecial }

            //借款申请期限
            data.loanApplyBaseInfo.loanApplyPeriodName = loanApplyPeriod + EnumMap.GetTimeUnit(loanApplyPeriodUnit);
            //还款方式
            data.loanApplyBaseInfo.repayWayName = EnumMap.GetReplaymentWayName(repayWay);
            //借款用途
            data.loanApplyBaseInfo.loanUseforName = EnumMap.GetBorrowerUseName(loanUsefor);
        }

        data.ContactInfo = Common2.GetContactInfo(data.contactList)

        return data;
    }

    /*address (string, optional): 居住地址 ,
    category (string, optional): 联系人分类 ,    联系人分类	01	亲属02	单位03	紧急
    contactName (string, optional): 联系人姓名 ,
    contactPhone (string, optional): 联系人手机号 ,
    relationship (string, optional): 联系人关系*/
    static GetContactInfo(dataList) {
        if (!dataList) return {};

        const data = {};
        dataList.forEach(d => {
            if (d.category === "01") {
                data.kinsfolkContactName = d.contactName;
                data.kinsfolkContactMobile = d.contactPhone;
                data.kinsfolkContactRelation = d.relationship;
                data.kinsfolkContactRelationName = EnumMap.GetKinsfolkRelationName(d.relationship);
                data.kinsfolkContactAddr = d.address;
            }
            else if (d.category === "02") {
                data.companyContactName = d.contactName;
                data.companyContactMobile = d.contactPhone;
                data.companyContactRelation = d.relationship;
                data.companyContactRelationName = EnumMap.GetCompanyRelationName(d.relationship);
                data.companyContactAddr = d.address;
            }
            else if (d.category === "03") {
                data.urgencyContactName = d.contactName;
                data.urgencyContactMobile = d.contactPhone;
                data.urgencyContactRelation = d.relationship;
                data.urgencyContactRelationName = EnumMap.GetUrgencyRelationName(d.relationship);
                data.urgencyContactAddr = d.address;
            }
        });

        return data;
    }

    static JoinTwoValues(value1, value2, joinStr, isDate) {
        const values = [];
        if (value1) values.push(isDate ? value1.substring(0, 10) : value1);
        if (value2) values.push(isDate ? value2.substring(0, 10) : value2);
        return values.join(joinStr);
    }

    static GetLenName(len) {
        if (len === 0) return "一";
        else if (len === 1) return "二";
        else if (len === 2) return "三";
        else if (len === 3) return "四";
        else if (len === 4) return "五";

        return len + 1;
    }

    static GetPatchRecordEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetPatchRecordList", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    static SetGetPatchRecordEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (Common.IsArray(data.materialList)) {
            data.materialList.forEach(d => {
                d.Id = Common.CreateGuid();
                d.Title = "补件编号：" + d.supplementId;
                d.approvalResultName = EnumMap.GetApprovalReusltName(d.approvalResult)
            })
            return { RecordList: data.materialList };
        }

        return data;
    }

    static GetOrderStatus(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderStatus", { loanApplyId: data.OrderCode, Action: this.GetAction(id, actionType) });
    }

    static SetGetOrderStatus(id, actionType, data) {
        data = this.SetApiResponse(data);

        data.OrderStatus = EnumMap.GetOrderStatusName(data.workOrderState)
        return data;
    }

    //"07", "终审等待签约条件""01", "初审审核","02", "初审电核","04", "终审审核",
    static GetPatchExitOrderInfo(id, actionType, data, approvalType) {
        this.DvaActions.Dispatch("OrderService", "GetPatchExitOrderInfo", { ...data.EntityData, approvalType, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    static SetGetPatchExitOrderInfo(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.supplementMaterial) {
            data.supplementMaterial.Id = Common.CreateGuid();
            data.supplementMaterial.Title = "补件编号：" + data.supplementMaterial.supplementId;
            data.supplementMaterial.approvalResultName = EnumMap.GetApprovalReusltName(data.supplementMaterial.approvalResult)
            data.PatchRecord = { RecordList: [data.supplementMaterial] }
        }

        if (data.backWorkOrder) {
            data.backWorkOrder.Id = Common.CreateGuid();
            data.backWorkOrder.Title = "退单编号：" + data.backWorkOrder.backId;
            data.backWorkOrder.approvalResultName = EnumMap.GetApprovalReusltName(data.backWorkOrder.approvalResult)
            data.RefundOrder = { RecordList: [data.backWorkOrder] }
        }

        return data;
    }

    static SetOrderDataList(dataList) {
        dataList.forEach(d => {
            const productCategoryName = EnumMap.GetProductCategoryName(d.productCategory);
            d.loanUser = `${d.loanSellerName}（${d.loanSellerDepartment}）`;
            d.productType = `${productCategoryName}/${d.productShortName}`;
            d.orderStatus = EnumMap.GetOrderStatusName(d.workOrderState);
            d.statusName = EnumMap.GetOrderStatusName(d.status);
            d.taskId = Common2.GetTaskId(d);
            d.taskAssigneeId = Common2.GetTaskAssigneeId(d);
        });
    }

    static GetTaskId(d) {
        if (d.taskList && d.taskList.length > 0) {
            return d.taskList[0].taskId;
        }
        return "";
    }

    static GetTaskAssigneeId(d) {
        if (d.taskList && d.taskList.length > 0) {
            return d.taskList[0].taskAssigneeId;
        }
        return "";
    }

    static GetEntityData(id, actionType, data, entityName, primaryKey, propertyPrimaryKey, nullTipMessage) {
        const editData2 = Common2.GetEntityData2(data, entityName, primaryKey, propertyPrimaryKey, nullTipMessage);

        this.Dispatch(id, actionType, editData2);
    }

    static GetEntityData2(data, entityName, primaryKey, propertyPrimaryKey, nullTipMessage) {
        const { EntityData } = data;
        const editData = Common.GetStorage("EditEntityData");
        let msg = "", editData2 = null;
        if (Common.IsNullOrEmpty(editData)) msg = nullTipMessage;
        else editData2 = JSON.parse(editData);

        var id = EntityData[primaryKey];
        if (!id) id = EntityData[propertyPrimaryKey];
        if (editData2 && (!editData2[entityName] || !Common.IsEquals(editData2[entityName][propertyPrimaryKey], id))) msg = nullTipMessage;

        if (msg) editData2 = { IsSuccess: false, Message: msg }
        else editData2 = editData2[entityName];

        return editData2;
    }

    static SetGetFinalApprovalResult(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.approveLoanPeriod) {
            data.approveLoanPeriodName = data.approveLoanPeriod + EnumMap.GetTimeUnit(data.approveLoanPeriodUnit);
            data.ApprovedLoanPeriodValue = data.approveLoanPeriod + "," + data.approveLoanPeriodUnit;
        }
        if (data.repaymentPeriodWay) data.repaymentPeriodWayName = data.repaymentPeriodWay + EnumMap.GetTimeUnit(data.repaymentPeriodWayUnit);
        data.repaymentWayName = EnumMap.GetReplaymentWayName(data.repaymentWay);
        data.annulCalcWayName = EnumMap.GetAnnualCalcWayName(data.annulCalcWay);
        data.annualCalcWay = data.annulCalcWay;
        data.periodWayUnit = data.repaymentPeriodWayUnit;
        data.periodWay = data.repaymentPeriodWay;

        /*DC100011	费用类型	01	信息管理费02	信息服务费03	罚息*/
        if (data.finalApprovalFeeInfoResult && data.finalApprovalFeeInfoResult.feeResultList) {
            data.finalApprovalFeeInfoResult.feeResultList.forEach(d => {
                if (d.feeType === "01") {
                    data.InfoManageRate = d.feeRate;
                    data.ManageCollectionType = d.chargeStage;
                    data.ManageCollectionMethod = d.chargeWay;
                    data.ManageCollectionTypeName = EnumMap.GetCollectionTypeName(d.chargeStage);
                    data.ManageCollectionMethodName = EnumMap.GetCollectionMethodName(d.chargeWay);
                }
                else if (d.feeType === "02") {
                    if (data.ServiceCollectionMethod) {
                        data.InfoServiceRate2 = d.feeRate;
                        data.ServiceCollectionType2 = d.chargeStage;
                        data.ServiceCollectionMethod2 = d.chargeWay;
                        data.ServiceCollectionTypeName2 = EnumMap.GetCollectionTypeName(d.chargeStage);
                        data.ServiceCollectionMethodName2 = EnumMap.GetCollectionMethodName(d.chargeWay);
                    }
                    else {
                        data.InfoServiceRate = d.feeRate;
                        data.ServiceCollectionType = d.chargeStage;
                        data.ServiceCollectionMethod = d.chargeWay;
                        data.ServiceCollectionTypeName = EnumMap.GetCollectionTypeName(d.chargeStage);
                        data.ServiceCollectionMethodName = EnumMap.GetCollectionMethodName(d.chargeWay);
                    }
                }
                else if (d.feeType === "03") {
                    data.FineRate = d.feeRate;
                }
            });
        }

        return data;
    }
}