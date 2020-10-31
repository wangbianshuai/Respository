import React from "react";
import { usePage } from "UseHooks";
import Components from "Components";

export default (props) => {
    const pageAxis = usePage('personCenter_changePassword', props, mapStateToProps);

    if (pageAxis === null) return null;

    return (
        <Components.PropertyItem property={pageAxis.pageConfig} pageId={pageAxis.id} />
    )
}

function mapStateToProps(state) {
    return {
        loading: state.AppUserService.changePassword_loading,
        changePassword: state.AppUserService.changePassword
    }
}