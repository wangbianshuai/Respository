// import React from "react";
// import { connect } from "dva";
// import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "UseHooks";
// import { EnvConfig} from "UtilsCommon";
// import Components from "Components";

// class ChangePassword extends BaseIndex {
//     constructor(props) {
//         super(props);

//         this.name = "PersonCenter_ChangePassword";

//         this.initEventAction();
//     }

//     render() {
//         return (
//             <Components.PropertyItem property={this.pageConfig} pageAxis={this.pageAxis} />
//         )
//     }
// }

// function mapStateToProps(state, ownProps) {
//     const props = StaticIndex.MapStateToProps(state, ownProps, {
//         ChangePassword: state.ApiService.ChangePassword
//     });

//     !EnvConfig.isProd && console.log(props);
//     return props;
// }

// export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("PersonCenter_ChangePassword", ChangePassword)));

export default ()=>{

    return <div></div>
};