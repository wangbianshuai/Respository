// import React from "react";
// import { connect } from "dva";
// import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "UseHooks";
// import { EnvConfig} from "UtilsCommon";
// import Components from "Components";

// class changePassword extends BaseIndex {
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
//         changePassword: state.ApiService.changePassword
//     });

//     !EnvConfig.isProd && console.log(props);
//     return props;
// }

// export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("PersonCenter_ChangePassword", changePassword)));

export default ()=>{

    return <div></div>
};