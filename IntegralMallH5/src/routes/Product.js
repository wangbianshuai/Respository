import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import { Flex, WingBlank, WhiteSpace, Button } from "antd-mobile";
import Index from "./Index"
import styles from "../styles/Product.css";
import Header from "../components/Header";

class Product extends Index {
    constructor(props) {
        super(props)

        this.Title = "商品详情";
        this.EntityName = "Product";

        this.state = {
            Title: this.Title,
        };

        this.componentWillMount2();
    }

    componentWillMount2() {
        //获取查询字符串
        this.QueryString = Common.GetQueryString();
        //获取用户住处与访问Token
        this.ProductId = Common.GetObjValue(this.QueryString, "ProductId");
    }

    componentDidMount() {
        if (!this.JudgeLogin()) return;
        //调用后台获取所有产品
        const payload = { ProductId: this.ProductId };
        this.Dispatch("Product", "Product", payload);


        //获取客户积分余额 Common.GetStorage("LoginUserId")
        this.Dispatch("Account", "GetAccountIntegralBalance", { AccountId: this.props.UserInfo.UserId })
    }

    PropsChanged(nextProps) {
        //TODO
    }

    //点击兑换按钮，跳转到产品确认兑换页面
    ConfirmExchange() {
        this.props.ToPage(`ProductExchange`);
    }

    render() {
        if (!this.props.Product) return null;
        const currentIntegral = this.props.AccountIntegralBalance ? this.props.AccountIntegralBalance.IntegralBalance : 0;
        const isDisabled = Common.IsNullOrEmptyReturnDefault(currentIntegral, 0) < this.props.Product.ProductPrice;

        return (
            <Flex direction="column" className={styles.rootFlex}>
                <Header Page={this} Title={this.state.Title} IsRight={false} IsShowBack={true} BackUrl={"AllProducts"} />

                <div className={styles.bodyContentDiv}>
                    <div className={styles.bodyScorllContentDiv}>
                        <Flex justify="center" className={styles.topFlex}>
                            <img src={this.props.Product.PicturePath} alt="img" />
                        </Flex>

                        <WhiteSpace size="sm" />

                        <Flex direction="column" align="start" className={styles.textFlex}>
                            <Flex.Item>
                                <WingBlank>
                                    <div className={styles.divNameText}>{this.props.Product.ProductName}</div>
                                </WingBlank>
                            </Flex.Item>
                            <Flex.Item>
                                <Flex justify="around" wrap="nowrap" direction="column" align="start" className={styles.textSubFlex} >
                                    <Flex.Item >
                                        <WingBlank>
                                            <div className={styles.divNameText}>兑换积分
                                    <span>  </span>
                                                <span>
                                                    {this.props.Product.ProductPrice}
                                                </span>
                                            </div>
                                        </WingBlank>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <WingBlank>
                                            <div className={styles.divCategoryText}>{this.props.Product.CategoryName}</div>
                                        </WingBlank>
                                    </Flex.Item>
                                </Flex>
                            </Flex.Item>
                        </Flex>

                        <WhiteSpace size="xl" />

                        <Flex direction="column" align="start" className={styles.contentFlex}>
                            <WingBlank>
                                <span>商品描述</span>
                                <WhiteSpace size="xs" />
                                <div dangerouslySetInnerHTML={{ __html: this.props.Product.ProductDescription }} />
                                <WhiteSpace size="xl" />

                                <span>兑换流程</span>
                                <WhiteSpace size="xs" />
                                <span>
                                    (1)点击立即兑换兑换商品;
                                <WhiteSpace size="xs" />
                                    (2)线下产品兑换后请选择您的客户经理所在职场;
                                <WhiteSpace size="xs" />
                                    (3)兑换成功后客户经理将于30个工作日内转交;
                                </span>

                                <WhiteSpace size="xl" />

                                <span>重要明细</span>
                                <WhiteSpace size="xs" />
                                <span>
                                    {/* {this.props.Product.ProductName} */}
                                    (1)本产品只可在夸客优富平台兑换,兑换后有效期为30天,30天后失效;
                                <WhiteSpace size="xs" />
                                    (2)若因收货地址不详或个人原因导致快递无法送达,不予补寄;
                                <WhiteSpace size="xs" />
                                    (3)除商品异常导致不能正常兑换外,一经兑换,一律不退还积分;
                                </span>

                                <WhiteSpace size="xl" />
                            </WingBlank>
                        </Flex>
                    </div>
                </div>

                <div className={styles.submitButtonDiv}>
                    {isDisabled ?
                        <div className={styles.submitButtonDisabled}>
                            <span >积分不足</span>
                        </div>
                        :
                        <Button className={styles.submitButton} onClick={this.ConfirmExchange.bind(this)}>
                            兑换商品
                        </Button>
                    }
                </div>
            </Flex>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
        Product: state.Product.Product,
        AccountIntegralBalance: state.Account.AccountIntegralBalance,
        UserInfo: state.Account.UserInfo,
        Loading: state.Account.Loading || state.Product.Loading,
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(Product)
