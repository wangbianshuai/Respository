import { Common } from "UtilsCommon";

export default class Common2 {

    //获取工单基本信息
    static GetOrderInfoEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderDetailEntityData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    static SetGetOrderInfoEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.OrderInfo) return data.OrderInfo;

        return data;
    }

    static GetOrderDetailEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderDetailEntityData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    static SetGetOrderDetailEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (!data.CarList || data.CarList.length === 0) data.CarList = [{ Id: Common.CreateGuid(), Title: "车产信息一" }];
        else data.CarList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "车产" + Common2.GetLenName(i); });

        if (!data.HouseList || data.HouseList.length === 0) data.HouseList = [{ Id: Common.CreateGuid(), Title: "房产信息一" }];
        else data.HouseList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "房产" + Common2.GetLenName(i); });

        data.PersonPropertyInfo = {
            CarList: data.CarList,
            HouseList: data.HouseList
        };

        if (data.PersonCardInfo) {
            const entityData = data.PersonCardInfo;
            entityData.Period = Common2.JoinTwoValues(entityData.PeriodStart, entityData.PeriodEnd, " - ");
        }

        if (data.PersonBaseInfo) {
            const entityData = data.PersonBaseInfo;
            entityData.HousePeriod = Common2.JoinTwoValues(entityData.HousePeriodStart, entityData.HousePeriodEnd, " - ");
        }

        if (data.CompanyBaseInfo) {
            const entityData = data.CompanyBaseInfo;
            entityData.CompanyHousePeriod = Common2.JoinTwoValues(entityData.CompanyHousePeriodStart, entityData.CompanyHousePeriodEnd, " - ");
        }

        data.AttachmentInfo = { SpecialOrderRemark: "重要提醒：当前为特殊件2" }

        return data;
    }

    static JoinTwoValues(value1, vlaue2, joinStr) {
        const values = [];
        if (value1) values.push(value1);
        if (vlaue2) values.push(vlaue2);
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

    static GetAllIndustry(id, actionType, data) {
        //获取缓存，如果存在，那就获取不加载，否则，获取且加载，采用此次使用上次获取数据方式。
        const action = this.GetAction(id, actionType);

        const allIndustry = Common.GetStorage("AllIndustry");
        if (!Common.IsNullOrEmpty(allIndustry)) {
            action.IsLoad = true;

            data = JSON.parse(allIndustry);
            data.Id = id;

            Common2.SetIndustryActions.call(this, data);
        }
        this.DvaActions.Dispatch("UserCenterService", "GetAllIndustry", { data: {}, Action: action }, false);
    }

    static SetGetAllIndustry(id, actionType, data) {
        const action = data.Action;
        data = this.SetApiResponse(data);
        if (data.IsSuccess === false) return data;

        const Industry1 = [], Industry2 = [], Industry3 = [], Industry4 = [];

        data.forEach(d => {
            switch (d.categoryLevel) {
                case 1: { Industry1.push(d); break; }
                case 2: { Industry2.push(d); break; }
                case 3: { Industry3.push(d); break; }
                case 4: { Industry4.push(d); break; }
                default: break;
            }
        });

        Industry2.forEach(d => {
            const parent = Common.ArrayFirst(Industry1, (f) => f.id === d.parentId);
            if (parent) d.parentId = parent.categoryName;
        });

        Industry1.forEach(d => d.id = d.categoryName);

        const allIndustry = { Industry1, Industry2, Industry3, Industry4 }

        Common.SetStorage("AllIndustry", JSON.stringify(allIndustry))

        if (!action.IsLoad) {
            allIndustry.Id = action.Id;
            Common2.SetIndustryActions.call(this, allIndustry);
        }

        return false;
    }

    static SetIndustryActions(data) {
        const { SetIndustry } = this.ActionTypes;

        const id = data.Id;
        this.Dispatch(id, SetIndustry, data);
    }

    static GetPatchRecordEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetPatchRecordList", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    static SetGetPatchRecordEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (Common.IsArray(data)) {
            data.forEach(d => {
                d.Id = Common.CreateGuid();
                d.Title = "补件编号：" + d.PatchCode;
            })
            return { RecordList: data };
        }

        return data;
    }

    static GetOrderStatus(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderStatus", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    static SetGetPatchExitOrderInfo(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (Common.IsArray(data.PatchRecord)) {
            data.PatchRecord.forEach(d => {
                d.Id = Common.CreateGuid();
                d.Title = "补件编号：" + d.PatchCode;
            })
            data.PatchRecord = { RecordList: data.PatchRecord }
        }

        if (Common.IsArray(data.RefundOrder)) {
            data.RefundOrder.forEach(d => {
                d.Id = Common.CreateGuid();
                d.Title = "退单编号：" + d.RefundOrderCode;
            })
            data.RefundOrder = { RecordList: data.RefundOrder }
        }

        return data;
    }
}