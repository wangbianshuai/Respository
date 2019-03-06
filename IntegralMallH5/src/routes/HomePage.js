import React from "react"
import { Carousel, Flex } from 'antd-mobile';
import { connect } from "dva"
import * as Common from "../utils/Common"
import { Link } from 'dva/router';
import Index from "./Index"
import styles from "../styles/HomePage.css";

import Header from "../components/Header";
import HomeRecommandView from "../components/HomeRecommandView";
import ProductListView from "../components/ProductListView";

class HomePage extends Index {
    constructor(props) {
        super(props)

        this.IsProductItem = true;
        this.EntityName = "HomePage";
        this.state = { Visible: false };
        this.componentWillMount2();
    }

    componentWillMount2() {
        //获取查询字符串
        this.QueryString = Common.GetQueryString();
        //获取用户信息与访问Token
        this.UserInfo = Common.GetObjValue(this.QueryString, "JifenId");
        this.AccessToken = Common.GetObjValue(this.QueryString, "token")

        //开发设置值
        if (!Common.IsDist) {
            this.UserInfo = "GbSYH4aGPorCl/z0tY3k2YMSViP51WdX";
            this.AccessToken = "43AE90FEAA314853869A6D3BB3192050";
        }

        if (!Common.IsNullOrEmpty(this.UserInfo) && !Common.IsNullOrEmpty(this.AccessToken)) {
            this.SetActionState("Account", "SetUserInfoAccessToken", { UserInfo: this.UserInfo, AccessToken: this.AccessToken });
        }
        else if (this.props.UserInfoAccessToken) {
            this.UserInfo = this.props.UserInfoAccessToken.UserInfo;
            this.AccessToken = this.props.UserInfoAccessToken.AccessToken;
        }
    }

    componentDidMount() {
        Common.SetStorage("Token", "");
        Common.SetStorage("LoginUserId", "");

        //调用用户访问
        const payload = { UserInfo: this.UserInfo, AccessToken: this.AccessToken };
        this.Dispatch("Account", "UserAccess", payload);

        this.setState({ Visible: false });
    }

    PropsChanged(nextProps) {
        //用户访问
        this.ReceiveUserAccess(nextProps);
    }

    ReceiveUserAccess(nextProps) {
        if (this.JudgeChanged(nextProps, "UserInfo") && nextProps.UserInfo.UserId) {
            Common.SetStorage("Token", nextProps.UserInfo.Token);
            Common.SetStorage("LoginUserId", nextProps.UserInfo.UserId);
            //验证用户信息成功后，进入首页，三个推荐产品和热门兑换产品

            //获取热门商品列表
            const payload = { LabelName: "热门商品" };
            this.Dispatch("Product", "HotProduct", payload);//第一个参数是命名空间，第二个参数是ActionName，第三个参数是请求的参数

            //获取推荐商品列表
            const payload2 = { LabelName: "推荐商品", TopCount: 3 };
            this.Dispatch("Product", "RecommandProduct", payload2);

            //获取客户积分余额
            this.Dispatch("Account", "GetAccountIntegralBalance", { AccountId: nextProps.UserInfo.UserId })

        } else if (this.JudgeChanged(nextProps, "ProductList") && nextProps.ProductList) {
            //获取热门商品列表
        } else if (this.JudgeChanged(nextProps, "RecommandProductList") && nextProps.RecommandProductList) {
            //获取推荐商品列表
        }
    }

    RenderHeader() {
        return null
    }

    render() {
        if (!this.props.UserInfo) return null;
        if (!this.props.ProductList) return null;
        if (!this.props.RecommandProductList) return null;

        const { AccountIntegralBalance } = this.props;
        const integralBalance = AccountIntegralBalance && AccountIntegralBalance.IntegralBalance ? AccountIntegralBalance.IntegralBalance : 0;

        //热门产品列表
        const productList = this.props.ProductList.Products;
        //将product列表转化为product数组的列表
        const productArrayList = Common.ReBuildProductList(productList);

        //推荐产品列表
        const recommandProductList = this.props.RecommandProductList.Products;

        //banner轮播图片
        const homeImgs = Array.from(new Array(3)).map(() => ({
            imgPath: "http://172.16.6.1:12300/resources/images/20180802/6366881909103054886694038.png",
            jumpUrl: "",
            Id: Common.CreateGuid(),
        }));

        //中间导航栏图片和文本
        const middleflexItems =
            [
                {
                    imgPath: "http://172.16.6.1:12300/resources/images/20180802/6366882040678584513644245.png",
                    imgText: "全部商品",
                    jumpUrl: "AllProducts",
                    Id: Common.CreateGuid(),
                },
                {
                    imgPath: "http://172.16.6.1:12300/resources/images/20180802/6366882044991052108969315.png",
                    imgText: "任务中心",
                    jumpUrl: "/",
                    Id: Common.CreateGuid(),
                },
                {
                    imgPath: "http://172.16.6.1:12300/resources/images/20180802/6366882046872335787754409.png",
                    imgText: "积分抽奖",
                    jumpUrl: "/",
                    Id: Common.CreateGuid(),
                },
                {
                    imgPath: "http://172.16.6.1:12300/resources/images/20180802/6366882049436389503321739.png",
                    imgText: "节日专区",
                    jumpUrl: "/",
                    Id: Common.CreateGuid(),
                },
            ];

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <Header Page={this} Title={"积分商城"} IsShowBack={true} BackUrl={"GoApp"} />
                <Carousel
                    className={styles.carousel}
                    vertical={false}
                    dots={true}
                    autoplay={true}
                    infinite
                    selectedIndex={0}
                //beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                // afterChange={index => console.log('slide to', index)}
                >
                    {
                        homeImgs.map((item, index) => {
                            return <div className={styles.v_item} key={item.Id}>
                                <img src={item.imgPath} alt="img" style={{ width: "100%", height: "100%" }} />
                            </div>
                        })
                    }
                </Carousel>

                <Flex className={styles.menuflex}>
                    <Flex.Item style={{ width: "49%", height: "100%" }} >
                        <div style={{ alignItems: "center", height: "7.19rem" }} onClick={() => { this.props.ToPage("MyCredit") }}>
                            <img src={require("../images/jifen3.png")} alt="img" style={{ width: '2rem', height: '3rem', marginTop: "1rem" }} />
                            <div className={styles.text1}>{integralBalance} 积分</div>
                        </div>
                    </Flex.Item>
                    <div className={styles.lineDiv} >
                        <div className={styles.line} ></div>
                    </div>
                    <Flex.Item style={{ width: "49%", height: "100%" }} >
                        <div style={{ alignItems: "center", height: "7.19rem" }} onClick={() => { this.props.ToPage("ExchangeRecord") }}>
                            <img src={require("../images/jilu3.png")} alt="img" style={{ width: '2.5rem', height: '3rem', marginTop: "1rem" }} />
                            <div className={styles.text2} >兑换记录</div>
                        </div>
                    </Flex.Item>
                </Flex>

                <div className={styles.blankdiv} />

                <Flex className={styles.middleflex}>
                    {
                        middleflexItems.map((item, index) => {
                            return <Flex.Item className={styles.flexitem} key={item.Id} >
                                <Link to={item.jumpUrl}>
                                    <div className={styles.divbox}>
                                        <img src={item.imgPath} alt="img" className={styles.divboximg} />
                                        <div className={styles.divboxtext}>{item.imgText}</div>
                                    </div>
                                </Link>
                            </Flex.Item>
                        })
                    }
                </Flex>

                <div className={styles.blankdiv} />

                <div className={styles.productListViewDiv}>
                    <HomeRecommandView DataList={recommandProductList} />
                </div>

                <div className={styles.blankdivContainer}>
                    <img src={require("../images/hottitle1.png")} alt="img" className={styles.divimg} />
                </div>

                <div className={styles.productListViewDiv}>
                    <ProductListView DataList={productArrayList} />
                </div>
            </div>

        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
        UserInfo: state.Account.UserInfo,
        Loading: state.Account.Loading || state.Product.Loading,
        ProductList: state.Product.ProductList,
        UserInfoAccessToken: state.Account.UserInfoAccessToken,
        RecommandProductList: state.Product.RecommandProductList,
        AccountIntegralBalance: state.Account.AccountIntegralBalance
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(HomePage)