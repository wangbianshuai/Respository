import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import { Flex, WingBlank, WhiteSpace, Button, List, InputItem, Modal } from "antd-mobile";

import Index from "./Index"
import styles from "../styles/ProductExchange.css";
import Header from "../components/Header";

const Item = List.Item;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class ProductExchange extends Index {
    constructor(props) {
        super(props)

        this.Title = "确认兑换";
        this.EntityName = "ProductExchange";

        this.state = {
            Title: this.Title,
            CurrentCount: 1,
        };

        this.componentWillMount2();
    }

    componentWillMount2() {
    }

    componentDidMount() {
        if (!this.JudgeLogin()) return;
        //获取客户积分余额，在产品页面已经调用过积分，兑换的时候是否还需要调用？
        // this.Dispatch("Account", "GetAccountIntegralBalance", { AccountId: this.props.UserInfo.UserId })
    }

    PropsChanged(nextProps) {
        if (this.JudgeChanged(nextProps, "ProductExchangeResult") && nextProps.ProductExchangeResult) {
            this.props.ToPage("ProductExchangeResult");//返回兑换结果页
        }
    }

    //增加减少兑换数量
    calculateCount(increase) {
        let currentCount = Common.GetIntValue(this.state.CurrentCount);
        if (currentCount <= 1 & increase === -1) {
            this.ShowMessage("兑换数量不能小于1");
        } else if (currentCount >= 999 & increase === 1) {
            this.ShowMessage("兑换数量不能大于999");
        }
        else {
            currentCount += increase;
            this.setState({ CurrentCount: currentCount });
        }
    }

    //兑换数量文本改变的时候，更新当前兑换数量，重新渲染组件
    onChange(e) {
        if (e.indexOf(".") >= 0) {
            this.ShowMessage("兑换数量不能有小数点");
        } else {
            let inputCount = Common.GetIntValue(e);
            if (inputCount < 1) {
                this.ShowMessage("兑换数量不能小于1");
            } else if (inputCount > 999) {
                this.ShowMessage("兑换数量不能大于999");
            } else {
                this.setState({ CurrentCount: e });
            }
        }
    }

    //确认兑换弹出层，参数：当前扣除积分 兑换数量
    ConfirmExchangePopup(totalIntegralCost, count) {
        Modal.alert('请确认', `本次兑换需扣除 ${totalIntegralCost} 积分`,
            [{ text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确认兑换', onPress: this.invokeExchangeService.bind(this, count)
            },
            ]);
    }

    invokeExchangeService(count) {
        //调用后台兑换产品 Common.GetStorage("LoginUserId")
        const payload = { AccountId: this.props.UserInfo.UserId, ProductId: this.props.Product.ProductId, ExchangeCount: count };
        this.Dispatch("Order", "Product", payload);

        //设置确认兑换按钮置灰
    }

    render() {
        if (!this.props.Product) return null;

        const currentIntegral = this.props.AccountIntegralBalance ? this.props.AccountIntegralBalance.IntegralBalance : 0;
        const totalIntegralCost = Common.GetIntValue(this.props.Product.ProductPrice) * this.state.CurrentCount;
        const isDisabled = Common.IsNullOrEmptyReturnDefault(currentIntegral, 0) < totalIntegralCost;

        return (
            <Flex direction="column"  >
                <Header Page={this} Title={this.state.Title} IsRight={false} IsShowBack={true} BackUrl={`Product?Productid=${this.props.Product.ProductId}`} />

                <List style={{ width: "100%", height: "34.4375rem" }}>
                    <Item>
                        <Flex direction="row" justify="center" align="center" className={styles.exchangeItemFlex}>
                            <Flex direction="row" justify="center" align="center" className={styles.imgFlex}>
                                <img src={this.props.Product.PicturePath} alt="img" className={styles.img} />
                            </Flex>

                            <WhiteSpace size="xs" />

                            <Flex direction="column" justify="center" align="start" className={styles.textFlex}>
                                <Flex direction="row" justify="start" align="start" className={styles.firstFlex}>
                                    <WingBlank size="sm"> <div className={styles.divNameText}>{this.props.Product.ProductName} </div></WingBlank>
                                    <WingBlank size="sm"> <div className={styles.divCategoryText}>{this.props.Product.CategoryName}</div></WingBlank>
                                </Flex>
                                <Flex direction="row" justify="start" align="start" className={styles.middleFlex}>
                                    <WingBlank size="sm">兑换积分</WingBlank>
                                    <WingBlank size="sm"><div className={styles.integralText}>{this.props.Product.ProductPrice}</div></WingBlank>
                                </Flex>
                                <Flex direction="row" justify="start" align="start" className={styles.endFlex}>
                                    <WingBlank size="sm"><div>数量：</div></WingBlank>
                                    <WingBlank size="lg" >
                                        <Flex direction="row" justify="end" align="baseline" className={styles.inputFlex}>
                                            {/* <div style={{ flex:1 }} onClick={this.calculateCount.bind(this, -1)}>
                                                <Button size="small" style={{ width: "2rem", height: "2rem" }}>-</Button>
                                            </div>
                                            <InputItem
                                                type="digit"
                                                onChange={this.onChange.bind(this)}
                                                value={this.state.CurrentCount}
                                                maxLength={999}
                                                ref={el => this.inputRef = el}
                                                onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                                clear
                                                moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                                                className={styles.inputItem}
                                                name="inputCount"
                                            ></InputItem>
                                            <div style={{ flex:1 }} onClick={this.calculateCount.bind(this, 1)}>
                                                <Button size="small" style={{ width: "2rem", height: "2rem"}}>+</Button>
                                            </div> */}
                                            <input name="" type="button" value="- " onClick={this.calculateCount.bind(this, -1)} style={{ width: "2rem", height: "1.42rem", borderradius: "0.3125rem" }} />
                                            <InputItem
                                                type="digit"
                                                onChange={this.onChange.bind(this)}
                                                value={this.state.CurrentCount}
                                                maxLength={999}
                                                ref={el => this.inputRef = el}
                                                onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                                clear
                                                moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                                                className={styles.inputItem}
                                                name="inputCount"
                                            ></InputItem>
                                            <input name="" type="button" value="+" onClick={this.calculateCount.bind(this, 1)} style={{ width: "2rem", height: "1.42rem", borderradius: "0.3125rem" }} />
                                        </Flex>
                                    </WingBlank>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Item>
                </List>

                <div className={styles.bottomDiv}>
                    <Flex direction="row" className={styles.bottomFlex}>
                        <Flex direction="row" justify="center" className={styles.totalIntegralFlex}>
                            <img src={require("../images/money.png")} alt="img" />
                            <WingBlank size="sm">合计积分：</WingBlank>
                            <div className={styles.integralText}>{totalIntegralCost}</div>
                        </Flex>
                        <Button size="large"
                            disabled={isDisabled ? true : false}
                            inline
                            onClick={this.ConfirmExchangePopup.bind(this, totalIntegralCost, this.state.CurrentCount)}
                            className={isDisabled ? styles.submitButtonDisabled : styles.submitButton}>
                            {isDisabled ? "积分不足" : "确认兑换"}
                        </Button>
                    </Flex>
                </div>
            </Flex>
        )
    }
}



function mapStateToProps(state, ownProps) {
    const props = {
        Product: state.Product.Product,   //从缓存中获取上一个页面的Product，并赋值给当前界面
        ProductExchangeResult: state.Order.ProductExchangeResult,  //获取产品兑换的结果，并存到缓存中，传给结果页面
        UserInfo: state.Account.UserInfo,
        AccountIntegralBalance: state.Account.AccountIntegralBalance,
        Loading: state.Account.Loading || state.Product.Loading || state.Order.Loading,

    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(ProductExchange)