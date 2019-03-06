import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Flex } from "antd-mobile";
// import styles from "../styles/AllProducts.css";
import ProductListView from "../components/ProductListView";
import Header from "../components/Header";
import ListViewTopBar from "../components/ListViewTopBar";

class AllProducts extends Index {
    constructor(props) {
        super(props)

        this.Title = "全部商品";
        this.EntityName = "AllProducts";

        this.state = {
            IsLoadingMore: false,
            Title: this.Title,
        };


        this.componentWillMount2();
    }

    componentWillMount2() {

    }

    componentDidMount() {
        if (!this.JudgeLogin()) return;
        //调用后台获取所有产品
        const payload = {  Sort: "DisplayIndex", SortAsc: true };
        this.Dispatch("Product", "AllProducts", payload);

        this.setState({ Visible: true });
    }

    RefreshListView(tagFilter, sortKey, isAsc) {
        const payload = { CategoryName: tagFilter, Sort: sortKey, SortAsc: isAsc };
        this.Dispatch("Product", "AllProducts", payload);

        this.setState({ Visible: true });
    }

    PropsChanged(nextProps) {
        //TODO
    }

    JumpSearchPage() {
        alert("to do");
    }

    RenderHeader() {
        return null
    }

    RenderSearch() {
        return null
    }

    render() {


        if (!this.props.ProductList) return null;

        //将product列表转化为product数组的列表
        const productArrayList = Common.ReBuildProductList(this.props.ProductList.Products);

        return (
            <Flex direction="column" style={{ height: "100%" }}>
                <Header Page={this} Title={this.state.Title} IsRight={true} RightAction={this.JumpSearchPage.bind(this)} IsShowBack={true} BackUrl={"/"} />
                <ListViewTopBar Page={this} />

                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ height: "100%", overflow: "auto" }}>
                        <ProductListView DataList={productArrayList} />
                    </div>
                </div>
            </Flex>
        )
    }
}



function mapStateToProps(state, ownProps) {
    const props = {
        Loading: state.Product.Loading || state.Account.Loading,
        UserInfo: state.Account.UserInfo,
        ProductList: state.Product.AllProductList,
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(AllProducts)