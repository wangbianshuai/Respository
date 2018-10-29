import ProcessOrderAttach from "../pagecomponents/ProcessOrderAttach";
import * as Common from "../utils/Common";

export default class OrderList {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.DataView.ExpandSetOperation = (actionList, record, index) => this.ExpandSetOperation(actionList, record, index);
        this.PageConfig.DataView.Properties.forEach(p => {
            if (p.Name === "OrderCode") this.SetOrderCodeRender(p);
            else p.IsRender = (text, record, index) => index % 2 !== 0;
        });
        this.PageConfig.DataView.IsPartPaging = true;
        this.PageConfig.DataView.ExpandedSetDataList = (dataList) => this.ExpandedSetDataList(dataList);
    }

    ExpandedSetDataList(dataList) {
        const list = [];
        dataList.forEach(d => {
            list.push({ key: Common.CreateGuid(), OrderName: d.OrderName, CustomerName: d.CustomerName });
            list.push(d);
        })
        return list;
    }

    SetOrderCodeRender(p) {
        p.Render = (text, record, index) => {
            if (index % 2 === 0) {
                return {
                    children: <div style={{ width: "100%" }}>
                        <div style={{ width: "50%", float: "left" }} ><span>客户：</span> <span style={{ color: "#1890ff" }}>{record.CustomerName}</span></div>
                        <div style={{ width: "50%", float: "left" }} ><span>门板花式：</span> <span style={{ color: "#1890ff", marginLeft: "20px" }}>{record.OrderName}</span></div>
                    </div>,
                    props: {
                        colSpan: 9
                    }
                };
            }
            else if (!Common.IsNullOrEmpty(text)) {
                let url = "";
                const dataValue = record[p.PropertyName];
                if (dataValue) url = p.PageUrl.replace("{" + p.PropertyName + "}", p.IsEscape === false ? dataValue : escape(dataValue));

                if (p.IsAddToken) {
                    const { LoginUser } = this.props.Page;
                    url = Common.AddUrlParams(url, "LoginUserId", LoginUser.UserId)
                    url = Common.AddUrlParams(url, "Token", LoginUser.Token)
                }
                if (p.IsRandom !== false) url = Common.AddUrlRandom(url);

                if (Common.IsNullOrEmpty(url)) return text;
                else {
                    if (url.toLowerCase().indexOf("http") !== 0) url = Common.DataApiUrl.replace("api/", "") + url;
                    return <a href={url} target="_blank">{text}</a>
                }
            }
            return text;
        }
    }

    ExpandSetOperation(actionList, record, index) {
        if (index % 2 === 0) return { children: null, props: { colSpan: 0 } };
        const billAction = { Name: "OrderBill", Text: "收支", IsToPage: true, PropertyNames: ["OrderCode", "OrderId"], PageUrl: "/Bill?OrderName2={OrderCode}&OrderId={OrderId}" };
        const lookAttach = { Name: "LookAttach", Text: "附件", ClickAction: this.LookAttach.bind(this) };

        if (record.OrderStatus === 2 || record.CreateUser !== this.Page.LoginUser.UserId) {
            actionList = [billAction, lookAttach]
            actionList.push({ Name: "Look", Text: "查看", ActionType: "EntityEdit", ActionName: "Look", EditPageUrl: "/OrderEdit" })
            return actionList;
        }
        else if (record.OrderStatus === 0) {
            let list = [billAction, lookAttach]
            list.push({ Name: "UpdateStatus1", Text: "加工", Title: "确定要提交加工吗？", StatusName: "OrderStatus", StatusValue: 1, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list = list.concat(actionList);
            return list;
        }
        else if (record.OrderStatus === 1) {
            let list = [billAction, lookAttach]
            list.push({ Name: "UpdateStatus2", Text: "存档", Title: "确定要存档完成吗？", StatusName: "OrderStatus", StatusValue: 2, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list.push({ Name: "UpdateAmount", Text: "收款", ActionType: "EntityEdit", ActionName: "Edit" })
            list.push(actionList[0])
            return list;
        }


        return actionList
    }

    LookAttach(property, params) {
        const title = "查看" + params.OrderCode + "附件";

        if (this.AttachView === undefined) {
            this.AttachView = { Id: Common.CreateGuid(), Title: title, Width: 900, Visible: true, IsOk: false };
            this.AttachView.PageId = Common.CreateGuid();
            this.AttachView.Component = this.GetComponent(params.OrderId, 2);
            this.Page.SetModalDialog(this.AttachView);
        }
        else { this.AttachView.Title = title; this.Load(params.OrderId, 2); }
    }


    GetComponent(orderId, fileType) {
        return <ProcessOrderAttach PageId={this.AttachView.PageId} Property={this.AttachView} Page={this.Page} OrderId={orderId} FileType={fileType} />
    }

    Load(orderId, fileType) {
        this.AttachView.LoadData && this.AttachView.LoadData(orderId, fileType);
    }
}