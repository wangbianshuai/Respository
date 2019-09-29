import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class Page extends BaseIndex {

    ToPage(props, action) {
        const { EventActions } = props;
        const url = Common.ReplaceDataContent(EventActions.PageData, action.PageUrl, true);
        EventActions.ToPage(url)
    }

    OpenUrl(props, action) {
        const { EventActions } = props;
        const url = Common.ReplaceDataContent(EventActions.PageData, action.PageUrl, true);
        EventActions.OpenPage(url);
    }

    ToAttachPage(props, action) {
        const { OrderCode, Token } = props.EventActions.PageData;
        const { DirType } = action;

        const params = ["productCode=risk"];
        params.push(`token=${Token}`);

        params.push(`applyCode=${OrderCode}`);

        const { Property } = props;
        let isRiskLook = false;

        //-1,进件详情 1:初审补单   2：终审补单  3：重审补单  4：实地审核附件   5：终审审核附件
        if (DirType && DirType !== -1) params.push(`type=${DirType}`);
        else if (!DirType) {
            let type = ""
            if (Property.PatchType) type = Property.PatchType;
            else if (Property.Data && Property.Data.requestUserRole) {
                const role = Property.Data.requestUserRole;
                if (role && role.indexOf("初审") >= 0) type = 1;
                else if (role && role.indexOf("终审") >= 0) type = 2;
                else if (role) type = 3;

                //记录中查看
                isRiskLook = true;
            }
            if (type) params.push(`type=${type}`);
        }

        if (!isRiskLook) isRiskLook = props.EventActions.IsRiskLook();

        params.push(`isRiskLook=${isRiskLook}`);

        let url = "/digital/digital.html?" + params.join("&");
        url = Common.AddUrlRandom(url);
        window.open(url)
    }

    ToQueryCustomer(props, action) {
        var queryString = "";
        const { Property, SearchValue } = props;
        if (Property.Name === "BorrowerUser") queryString = "LoanUser=" + escape(SearchValue);
        else queryString = "CompanyName=" + escape(SearchValue);
        const url = "/risk/Customer/QueryCustomer.html?" + queryString;
        window.open(url)
    }

    SetPropertiesVisible(props, action) {
        if (!action.Parameters) this.InitSetPropertiesVisible(props, action);

        const { Properties } = action.Parameters;
        const { Property } = props;

        this.SetViewPropertiesVisible(Properties, Property.IsExpanded)
    }

    InitSetPropertiesVisible(props, action) {
        const { EventActions } = props;

        const Properties = action.Properties.map(m => EventActions.GetView(m));

        action.Parameters = { Properties };
    }

    SetPropertiesExpandCollapse(props, action) {
        if (!action.Parameters) this.InitSetPropertiesExpandCollapse(props, action);

        const { Properties } = action.Parameters;
        const { Property } = props;

        this.SetViewPropertiesExpanded(Properties, Property.IsExpanded)
    }

    InitSetPropertiesExpandCollapse(props, action) {
        const { EventActions } = props;

        const Properties = action.Properties.map(m => EventActions.GetView(m));

        action.Parameters = { Properties };
    }
}