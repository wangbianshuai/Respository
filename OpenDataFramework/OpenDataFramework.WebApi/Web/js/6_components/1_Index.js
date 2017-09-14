((ns) => {
    const { Common } = ns.utils
    const { GetStateValue } = ns.data.Index

    ns.components.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)
        }

        GetHtml() { return "" }

        InitTagObject() { }

        EventLoad2() { }
        DataLoad2() { }

        EventLoad() {
            this.InitTagObject()
            this.ComponentList && this.ComponentList.forEach((c) => c.EventLoad())
            this.ControlList && this.ControlList.forEach((c) => c.EventLoad())
            this.EventLoad2()
        }

        DataLoad() {
            this.ComponentList && this.ComponentList.forEach((c) => c.DataLoad())
            this.ControlList && this.ControlList.forEach((c) => c.DataLoad())
            this.DataLoad2()
        }

        GetDataValue(state, name) {
            return GetStateValue(state, this.KeyName, name, this[name]).then((v) => {
                if (v != null) { this[name] = v }
                return Promise.resolve(v != null)
            })
        }

        IsFailMessage(res) {
            if (res.ActionFailedMessage) {
                Common.Alert(res.ActionFailedMessage)
                return true
            }
            return false
        }
    }

})($ns);