import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import Index from "./Index"
// import styles from "../styles/ExchangeRecord.css";
import ExchangeListView from "../components/ExchangeListView";
import Header from "../components/Header";

class ExChangeRecord extends Index {
    constructor(props) {
        super(props)//this:代表本类对象的引用。 super:代表父类的存储空间。
        this.Title = "兑换记录";
        this.EntityName = "ExChangeRecord";
        this.state = {
            Visible: false,
            Title: this.Title,
        };
        this.componentWillMount2();
    }

    // this.props.navigation.navigate("ExchangeDetail",{
    //     id:this.state.id,
    //     refresh:function(){
    //         this.init();
    //     }
    // });
    componentWillMount2() {
    }

    componentDidMount() {
        if (!this.JudgeLogin()) return;
        //获取兑换记录
        
        const payload = { UserId: this.props.UserInfo.UserId };
        this.Dispatch("Order", "ExChangeRecord", payload);
    }

    PropsChanged(nextProps) {

    }

    render() {
        
        if (!this.props.UserInfo) return null;
        if (!this.props.MyExchangeList) return null;
        //const ExchangeRecordArrayList = [{status:"1",credit:"20"}];
        return (
 
            <div>
                <Header Page={this} Title={this.state.Title} IsRight={false} IsShowBack={true} BackUrl={"/"} />
                <ExchangeListView DataList={this.props.MyExchangeList.MyOrderList} />
            </div>
        )

    }
}
function mapStateToProps(state, ownProps) {
    const props = {
        Loading: state.Order.Loading,
        UserInfo: state.Account.UserInfo,
        MyExchangeList: state.Order.MyExchangeList,
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(ExChangeRecord)