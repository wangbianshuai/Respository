import * as Common from "../utils/Common"
import Index from "./Index"

export default class Page extends Index {
    constructor(options) {
        super(options)

        this.Name = "Page";
        this.ServiceDataSourceProperty = {}
    }

    PropsChanged(props, nextProps) {
        this.ReceiveServiceDataSource(props, nextProps);
    }

    ReceiveServiceDataSource(props, nextProps) {
        for (let key in this.ServiceDataSourceProperty) {
            const p = this.ServiceDataSourceProperty[key];

            if (this.Page.JudgeChanged(nextProps, p.StateName)) {
                const dataList = nextProps[p.StateName];
                if (p.IsResponse) p.SetDataSource(dataList);
                else if (Common.IsArray(dataList)) p.SetDataSource(dataList);
            }
        }
    }

    GetServiceDataSource(property, action) {
        if (!action) return;

        property.StateName = action.StateName;
        this.ServiceDataSourceProperty[property.Id] = property;

        let payload = {};
        if (action.IsUrlParams) payload.Url = action.Url;

        this.Page.SetActionState(action);
        this.Page.Dispatch(action, payload)
    }

}