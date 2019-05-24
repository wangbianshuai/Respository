import Bridge from "./Bridge";
import Js2Native from "./Js2Native";
import Native2Js from "./Native2Js";

var _Bridge = null;

export default () => {
    if (_Bridge === null) {
        const bridge = new Bridge();
        _Bridge = { Js2Native: new Js2Native(bridge), Native2Js: new Native2Js(bridge) };
    }
    return _Bridge;
};