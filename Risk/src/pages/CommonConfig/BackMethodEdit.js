import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class BackMethodEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_BackMethodEdit";

        this.InitEventAction();
    }

    componentDidMount() {
        this.BackMethodEdit2 = this.GetViewProperty(this.PageConfig, "BackMethodEdit2");
        this.BackMethodEdit2.Properties.forEach(p => {
            if (p.Name === "MethodType") { this.MethodType = p; p.ValueChange = this.MethodTypeChange.bind(this); }
            else if (p.Name === "PeriodMethod") {
                this.PeriodMethod = p;
                p.ValueChange2 = this.PeriodMethodChange2.bind(this);
                if (p.SetReadOnly) p.SetReadOnly(true);
            }
        });
    }

    PeriodMethodChange2(value) {
        var type = this.MethodType.GetValue();
        this.PeriodMethod.SetReadOnly(value === "03", type !== "01");
        if (value === "03") this.PeriodMethod.SetValue(1);
    }

    MethodTypeChange(value) {
        if (value === "01") {
            const value2 = this.PeriodMethod.GetValue2();
            if (value2 === "03") {
                this.PeriodMethod.SetValue(1);
                this.PeriodMethod.SetReadOnly(true, false);
            }
            else this.PeriodMethod.SetReadOnly(false, false);
        }
        else if (value === "02") {
            this.PeriodMethod.SetValue(1);
            this.PeriodMethod.SetValue2("03");
            this.PeriodMethod.SetReadOnly(true, true);
        }
        else this.PeriodMethod.SetReadOnly(true, true);
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SaveEntityData: state.BackMethodService.SaveEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CommonConfig_BackMethodEdit", BackMethodEdit)));