import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import { Flex, WingBlank, WhiteSpace, Button, Icon } from "antd-mobile";

import Index from "./Index"
import styles from "../styles/ProductExchangeResult.css";
import Header from "../components/Header";

class ProductExchangeResult extends Index {
    constructor(props) {
        super(props)

        this.EntityName = "ProductExchangeResult";
        this.state = {
        };

        this.isSuccess = false;

        this.componentWillMount2();
    }

    componentWillMount2() {
    }

    componentDidMount() {
        if (!this.JudgeLogin()) return;
    }

    ExchangeCompleted() {
        //兑换成功，返回兑换记录页面，兑换失败返回上一页
        this.isSuccess ?
            this.props.ToPage("ExchangeRecord") :
            this.props.ToPage("ProductExchange");

    }

    render() {
        this.isSuccess = Common.IsNullOrEmpty(this.props.ProductExchangeResult.ExchangeMessage);
        if (!Common.IsNullOrEmpty(this.props.ProductExchangeResult.IsSuccess))
            this.isSuccess = this.props.ProductExchangeResult.IsSuccess;

        return (
            <Flex direction="column"  >
                <Header Page={this} Title={this.isSuccess ? "兑换成功" : "兑换失败"} IsRight={false} IsShowBack={false} />

                <Flex direction="column" justify="around" align="center" style={{ height: "20rem" }} >
                    <WhiteSpace size="lg" />
                    <Flex direction="column">
                        <Icon type="check-circle" size="lg" style={{ fill: '#1F90E6' }} />
                        <WhiteSpace size="lg" />
                        <WingBlank size="lg">
                            兑换{this.isSuccess ? "成功" : "失败"}
                        </WingBlank>
                    </Flex>
                    <WhiteSpace size="lg" />
                    <Flex>
                        <WingBlank size="lg">
                            {
                                this.isSuccess ?
                                    "到 会员-积分商城-兑换记录 查看该兑换详情" :
                                    Common.IsNullOrEmptyReturnDefault(this.props.ProductExchangeResult.ExchangeMessage, this.props.ProductExchangeResult.Message)
                            }
                        </WingBlank>
                    </Flex>
                    <Flex>
                        {/* <img /> */}
                        <WingBlank size="lg">
                            {
                                this.isSuccess ?
                                    `我们的供货商会尽快发往职场，由您的客户经理转交，如有疑问，请致电客户经理 ${Common.IsNullOrEmptyReturnDefault(this.props.ProductExchangeResult.ManagerPhone, "")}` :
                                    `兑换失败，请重新兑换，如有疑问，请致电客服经理 ${Common.IsNullOrEmptyReturnDefault(this.props.ProductExchangeResult.ManagerPhone, "")}`
                            }
                        </WingBlank>
                    </Flex>
                    <WhiteSpace size="lg" />
                </Flex>
                <WingBlank size="lg" className={styles.bottomWingBlank}>
                    <Button size="large"
                        inline
                        onClick={this.ExchangeCompleted.bind(this)}
                        className={styles.submitButton}>
                        完成
                    </Button>
                </WingBlank>
            </Flex>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = { ProductExchangeResult: state.Order.ProductExchangeResult, UserInfo: state.Account.UserInfo };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(ProductExchangeResult)

