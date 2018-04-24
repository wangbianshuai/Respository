import * as Common from "../utils/Common"
import Index from "./Index"

export default class Page extends Index {
    constructor(options) {
        super(options)

        this.Name = "Page";
        this.ServiceDataSourceProperty = {}
        this.RequestProperty = {};
    }

    PropsChanged(props, nextProps) {
        this.ReceiveServiceDataSource(props, nextProps);
        this.ReceiveResponse(props, nextProps);
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

    ReceiveResponse(props, nextProps) {
        for (let key in this.RequestProperty) {
            const p = this.RequestProperty[key];

            if (this.Page.JudgeChanged(nextProps, p.StateName)) {
                p.SetResponse(nextProps[p.StateName]);
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

    Request(property, action) {
        if (!action) return;

        property.StateName = action.StateName;
        this.RequestProperty[property.Id] = property;

        let payload = property.payload || {};
        if (action.IsUrlParams) payload.Url = action.Url;

        this.Page.SetActionState(action);
        this.Page.Dispatch(action, payload)
    }
}