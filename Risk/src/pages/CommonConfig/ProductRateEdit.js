import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class ProductRateEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductRateEdit";
        
        this.InitEventAction();
    }

    componentDidMount() {
        this.EditView = this.GetView("ProductRateEdit2");
        this.EditView.ExpandSetEntityData = this.SetEntityData.bind(this);
        this.SelectProduct = this.GetViewProperty(this.EditView, "ProductId");
    }

    SetEntityData(data) {
        data.productName = this.SelectProduct.GetText();
        return data;
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SaveEntityData: state.ProductRateService.SaveEntityData,
        ProductList: state.ProductService.DataList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CommonConfig_ProductRateEdit", ProductRateEdit)));