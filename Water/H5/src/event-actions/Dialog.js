import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class Dialog extends BaseIndex {
	
    //弹出实体编辑层
    ShowEntityEdit(props, action) {
        if (!action.Parameters) this.InitShowEntityEditAction(props, action);
        const { EventActions } = props;

        const { DialogView } = action.Parameters;

        const onOk = (dialogProperty) => this.SetShowEntityEdit(dialogProperty, props, action);
        this.ShowDialog(action, EventActions, DialogView, onOk, action.SetValue);
    }

    SetShowEntityEdit(dialogProperty, props, action) {
        const { DialogView } = action.Parameters;
        props.Property = dialogProperty;
        props.EditView = DialogView;
        props.EventActions.InvokeAction(DialogView.OkEventActionName, props)
    }

    InitShowEntityEditAction(props, action) {
        const { EventActions } = props;
        const DialogView = Common.ArrayFirst(EventActions.PageConfig.DialogViews, (f) => f.Name === action.DialogView);

        action.Parameters = { DialogView };
    }
}