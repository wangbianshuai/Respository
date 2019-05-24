export default class Bridge {
    constructor() {
        this.Native2JsList = [];
        this.Js2NativeInvokeList = [];
        this.Init();
    }

    Init() {
        this.SetupWebViewJavascriptBridge((bridge) => {
            this.Bridge = bridge;
            if (bridge) {
                if (this.IsAndroid()) bridge.init((message, responseCallback) => responseCallback({}));
                this.Native2JsList.forEach(n => this.Native2JsRegister(n.Name, n.Action));
                this.Js2NativeInvokeList.forEach(n => n());
            }
        });
    }

    Js2NativeAction(name, data, isCall) {
        isCall = isCall === undefined ? true : isCall;
        return new Promise((resolve, reject) => {
            try {
                if (!this.Bridge) resolve({ IsSuccess: false, Message: "bridge初始化失败！" });
                else if (isCall) this.Bridge.callHandler(name, data, (res) => resolve(typeof res === "string" ? JSON.parse(res) : res));
                else { this.Bridge.callHandler(name, data); resolve(null); }
            }
            catch (error) {
                resolve({ IsSuccess: false, Message: error.message || error })
            }
        });
    }

    Native2JsRegister(name, fn) {
        if (!this.Bridge) { this.Native2JsList.push({ Name: name, Action: fn }); return; }

        this.Bridge.registerHandler(name, (data, responseCallback) => responseCallback(fn(data)));
    }

    IsAndroid() {
        return navigator.userAgent.match(/okhttp/);
    }

    IsIOS() {
        return navigator.userAgent.match(/Xxd\/iOS_ELoan/);
    }

    SetupWebViewJavascriptBridge(callback) {
        //iOS使用
        if (this.IsIOS()) {
            if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge); }
            if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'https://__bridge_loaded__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0);
        }

        //Android使用
        if (this.IsAndroid()) {
            if (window.WebViewJavascriptBridge) callback(window.WebViewJavascriptBridge)
            else document.addEventListener('WebViewJavascriptBridgeReady', function () { callback(window.sWebViewJavascriptBridge) }, false);
        }
    }
}