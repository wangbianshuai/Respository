export default class Native2Js {
    constructor(bridge) {
        this.Bridge = bridge;
    }

    Reload(fn) {
        //刷新当前页面
        this.Bridge.Native2JsRegister("xxd_reload", fn);
    }
}