export default class Page {
    GetModel() {
        return {}
    }

    Init() {
        Page.Current = this;
    }

    InitInvoke(name, fn) {
        const obj = this.GetInstance(name);
        if (obj.IsInstance) fn(obj);
        else obj.InitFnList.push(fn);
    }

    GetInstance(name) {
        if (!this[name]) this[name] = { InitFnList: [] };
        return this[name];
    }

    InitInstance(name, invoke) {
        const obj = this.GetInstance(name);

        obj.IsInstance = true;
        obj.Invoke = invoke;
        obj.InitFnList.forEach(f => f(obj));

        return this[name];
    }

    Invoke(name, fnName) {
        const obj = this.GetInstance(name);
        if (obj.IsInstance) return obj.Invoke(fnName);
        return function () { };
    }
}

Page.Current = null;