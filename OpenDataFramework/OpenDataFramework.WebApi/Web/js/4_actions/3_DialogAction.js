((ns) => {
    const { Index } = ns.actions

    ns.actions.DialogOkAction = class DialogOkAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "确定"
        }

        Invoke(e, c) {
            this.Dialog.OkAction && this.Dialog.OkAction.Invoke(e, c)
        }
    }

    ns.actions.DialogSaveAction = class DialogSaveAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "保存"
        }

        Invoke(e, c) {
            c.Type = 1;
            this.Dialog.OkAction && this.Dialog.OkAction.Invoke(e, c)
        }
    }

    ns.actions.DialogSubmitAction = class DialogSubmitAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "保存并提交"
            this.Width = 100
        }

        Invoke(e, c) {
            c.Type = 2;
            this.Dialog.OkAction && this.Dialog.OkAction.Invoke(e, c)
        }
    }

    ns.actions.DialogCancelAction = class DialogCancelAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "取消"
        }

        Invoke(e, c) {
            this.Dialog.Close()
        }
    }

})($ns);