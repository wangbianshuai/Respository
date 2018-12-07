import React from "react";
import { Common, EnvConfig } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop, DialogFloat } from "ReactCommon";

export default (WrapComponent, options) => class Index extends BaseIndex {
    constructor(props) {
        super(props);

        this.Init();
    }

    Init() {
        this.Options = options || {};
        this.Page = this.props.Page;

        const { Page } = this;
        Page.Model = this.GetModel();
        Page.InvokeRootPage = this.Invoke();

        this.Tips = { List: [] };
        this.Dialogs = { List: [] };
    }

    GetModel() {
        return {
            title: this.GetTitle(),
            keywords: "新新贷，P2P网贷，P2P理财，投资理财，网上理财，新元宝，月月派，新手专享，投融资，贷款，企业贷款，无抵押小额贷款，借款",
            description: "新新贷是中国专业的互联网金融P2P网络借贷信息中介平台，为出借人和借款人提供省心的互联网金融信息服务。资金银行存管、严格的风控体系、信息披露透明等多重安全保障措施。"
        }
    }

    GetTitle() {
        if (this.Options.Title) return this.Options.Title;
        return "【新新贷官网】专业透明的P2P网络借贷平台，P2P网贷，网上贷款借款、投融资信息中介平台"
    }

    JudgeLogin() {
        return this.props.UserInfo && this.props.UserInfo.userid;
    }

    SetLoading(nextProps) {
        //if (nextProps.Loading) Toast.loading("加载中……", 0)
        //else if (nextProps.Loading === false) Toast.hide()
    }

    SetResponseMessage(d, stateName) {
        if (d && d.IsSuccess === false && d.Message) {
            this.ShowMessage(d.Message);
            return true;
        }

        return false
    }

    InitComponentList(name, add, addList) {
        this[name] = this[name] || { List: [] };
        this[name].Add = add;
        this[name].AddList = addList;
    }

    AddComponentList(name, list) {
        if (this[name] && this[name].AddList) this[name].List = this[name].AddList(list);
        else this[name].List = this[name].List.concat(list);
    }

    AddComponent(name, item) {
        if (this[name] && this[name].Add) this[name].List = this[name].Add(item);
        else this[name].List.push(item);
    }

    AddTipList(tiplist) {
        this.AddComponentList("Tips", tiplist);
    }

    Alert(msg, title, closeMills, isOk, callback) {
        title = title || "提示";
        closeMills = closeMills || 0;
        isOk = isOk === undefined ? true : isOk;
        this.AddComponent("Dialogs", <DialogFloat key={Common.CreateGuid()} Title={title} Content={msg} CloseMills={closeMills} IsOk={isOk} Callback={callback} />);
    }

    shouldComponentUpdate(nextProps, nextState) {
        //设置加载中显示
        if (nextProps.Loading !== this.props.Loading) this.SetLoading(nextProps);

        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined && this.props[key] !== nextProps[key]) {
                blChangedProps = true;

                if (this.SetResponseMessage(nextProps[key], key)) blChangedProps = false;

                if (blChangedProps) break;
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }

    ShowMessage(msg) {
        this.Alert(msg, "提示信息", 3000, true);
    }

    GetProps() {
        const PcBuildUrl = EnvConfig.GetClientBuildUrl();
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;
        return { PcBuildUrl, IsLogin, UserInfo, IsPurchased }
    }

    render() {
        const { Link, Dispatch } = this.props;
        const props = this.GetProps();
        const { PcBuildUrl } = props;

        return (
            <div id="J_wrapBody">
                <Header {...props} Page={this.Page} Dispatch={Dispatch} />
                <WrapComponent {...this.props}  {...props} Page={this.Page} Dispatch={Dispatch} />
                <Footer PcBuildUrl={PcBuildUrl} Link={Link} Page={this.Page} />
                <ComponentList Name="Tips" InitComponentList={this.InitComponentList.bind(this)} List={this.Tips.List} />
                <ComponentList Name="Dialogs" InitComponentList={this.InitComponentList.bind(this)} List={this.Dialogs.List} />
                <BackTop Page={this.Page} Dispatch={Dispatch} />
            </div>
        )
    }
}
