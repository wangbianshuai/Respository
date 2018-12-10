import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import {  WhiteSpace, Button,Modal } from "antd-mobile";
import Index from "./Index"
import styles from "../styles/ExchangeDetail.css";
import Header from "../components/Header";
import CardPasswordListView from "../components/CardPasswordListView";

class ExchangeDetail extends Index {
    constructor(props) {
        super(props)
        this.Title = "兑换详情";
        this.EntityName = "ExchangeDetail";
        this.ButtonVisable=true;
        this.OrderStatus="";

        this.state = {
            Title: this.Title,
            ButtonVisable:this.ButtonVisable,
            OrderStatus:this.OrderStatus,
            
        };

        this.componentWillMount2();
    }

    componentWillMount2() {
        if (!this.JudgeLogin()) return;
        //获取查询字符串
        this.QueryString = Common.GetQueryString();
        //获取用户住处与访问Token
        this.OrderId = Common.GetObjValue(this.QueryString, "OrderId");
    }

    componentDidMount() {
        //调用后台获取所有产品
    }

    PropsChanged(nextProps) {
        if (this.JudgeChanged(nextProps, "ComfirmDeliveredResult") && nextProps.ComfirmDeliveredResult) {
            this.setState({ ButtonVisable: false, OrderStatus: "已完成" });
        }
    }

     //确认收货，参数：订单号
    ConfirmDeliveredPopup(orderId) {
        Modal.alert('请确认', `确认收货`,
            [{ text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确认收货', onPress: this.invokeComfirmDeliveredService.bind(this, orderId)
            },
            ]);
    }

    invokeComfirmDeliveredService(orderId) {
        const payload = { AccountId: this.props.UserInfo.UserId, OrderId: orderId, OrderStatus: 4 };
        this.Dispatch("Order", "ComfirmDelivered", payload);
        //设置确认收货按钮置灰
    }

    renderOrder(orderList)
    {
        return(<div>
             <Header Page={this} Title={this.state.Title} IsRight={false} IsShowBack={true} BackUrl={"/ExchangeRecord"} />

             <div className={styles.ProductName}>{orderList.ProductName}</div>
             <div  className={styles.OrderDetail}>
                <div className={styles.OrderDetailName}>兑换积分：</div><div className={styles.orderDetailValue}>{orderList.IntegralValue}</div>
                <div className={styles.OrderDetailName}>商品数量：</div><div className={styles.orderDetailValue}>x{orderList.ProductNumber}</div>
                <div className={styles.OrderDetailName}>收货职场：</div><div className={styles.orderDetailValue}>{orderList.JobmarketName}</div>
                <div className={styles.OrderDetailName}>兑换时间：</div><div className={styles.orderDetailValue}>{orderList.OrderConfrimDate.replace('T',' ')}</div>
             </div>
             <div className={styles.TotalCredit}>
                 <div className={styles.TotalCreditName}>合计积分：</div>
                 <div className={styles.TotalCreditValue}>{orderList.OrderIntegralValue}</div>
            </div>

            <WhiteSpace size="xs" />
            
            <div className={styles.OrderStatus}>
              <div className={styles.OrderStatusImage}>  </div>
              <div className={styles.OrderStatusName}>订单状态：</div>
              <div className={styles.OrderStatusValue}>{Common.IsNullOrEmpty(this.state.OrderStatus)?orderList.OrderStatus:this.state.OrderStatus}</div>
            </div>

            {(orderList.OrderStatus==="已发货" || orderList.OrderStatus==="已送达") && this.state.ButtonVisable===true?
               (<Button size="small"
                    inline
                    onClick={this.ConfirmDeliveredPopup.bind(this, orderList.OrderId)}
                    className={styles.submitButton}
                    >
                   确认收货
                </Button>):null}
                <div className={styles.Notes}>客户经理会在30个工作日内转交，请耐心等待。<br /> 如有疑问请致电客服经理{this.props.ManagerPhone}</div>
              </div>
        )
    }

    renderCardPassword(orderList)
    {
        return(<div>
             <Header Page={this} Title={this.state.Title} IsRight={false} IsShowBack={true} BackUrl={"/ExchangeRecord"} />

             <div className={styles.ProductName}>{orderList.ProductName}</div>
             <div  className={styles.OrderDetail}>
                <div className={styles.OrderDetailName}>兑换积分: </div><div className={styles.orderDetailValue}>{orderList.IntegralValue}</div>
                <div className={styles.OrderDetailName}>商品数量：</div><div className={styles.orderDetailValue}>x{orderList.ProductNumber}</div>
                <div className={styles.OrderDetailName}>收货职场：</div><div className={styles.orderDetailValue}>{orderList.JobmarketName}</div>
                <div className={styles.OrderDetailName}>兑换时间：</div><div className={styles.orderDetailValue}>{orderList.OrderConfrimDate.replace('T',' ')}</div>
             </div>
             <div className={styles.TotalCredit}>
                 <div className={styles.TotalCreditName}>合计积分：</div>
                 <div className={styles.TotalCreditValue}>{orderList.OrderIntegralValue}</div>
            </div>

            <WhiteSpace size="xs" />
            
            <CardPasswordListView DataList={orderList.MyCPOrderList} />

         
              </div>
        )
    }

    render() {
        var orderList=GetCurrentRecor(this.props.MyOrderList,this.OrderId);
        return(<div>
        {orderList.MyCPOrderList.length===0?this.renderOrder(orderList):this.renderCardPassword(orderList)}
        </div>
        )
    }
}

function GetCurrentRecor(orderList,orderId)
{
    for (var index = 0; index < orderList.length; index++) {
        if(orderList[index].OrderId===orderId)
        {
            return orderList[index];
            break;
        }
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
        MyOrderList: state.Order.MyExchangeList.MyOrderList,
        UserInfo: state.Account.UserInfo,
        ComfirmDeliveredResult: state.Order.ComfirmDeliveredResult,  //获取产品兑换的结果，并存到缓存中，传给结果页面
        ManagerPhone:state.Order.MyExchangeList.ManagerPhone,
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(ExchangeDetail)