import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class QueryCustomer extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_QueryCustomer";
        this.MenuKey = "QueryCustomer";

        this.InitEventAction();

        this.Init();
    }

    Init() {
        this.LoanUser = this.PageData.LoanUser;
        this.CompanyName = this.PageData.CompanyName;

        if (this.LoanUser || this.CompanyName) {
            this.SearchOperationView1 = this.GetView("SearchOperationView1");
            this.DataGridView1 = this.GetView("DataGridView1");
            this.Keyword = this.GetViewProperty(this.SearchOperationView1, "Keyword");
            this.QueryName = this.GetViewProperty(this.SearchOperationView1, "QueryName");

            if (this.LoanUser) { this.QueryName.DefaultValue = "loanMainPart"; this.Keyword.DefaultValue = this.LoanUser; this.DataGridView1.IsSearchQuery = true; }
            else if (this.CompanyName) { this.QueryName.DefaultValue = "companyName"; this.Keyword.DefaultValue = this.CompanyName; this.DataGridView1.IsSearchQuery = true; }
        }
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        QueryCustomerOrderList: state.OrderService.QueryCustomerOrderList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Customer_QueryCustomer", QueryCustomer)));