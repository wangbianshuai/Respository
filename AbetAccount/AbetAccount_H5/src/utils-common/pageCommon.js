import { Toast, Modal } from 'antd-mobile';

let _Loading = false;
let _IsShowLoading = false;

export function setLoading(loading) {
    _Loading = loading;
    if (_Loading) setTimeout(() => {
        if (_Loading && !_IsShowLoading) {
            Toast.loading("加载中……", 0)
            _IsShowLoading = true;
        }
    }, 2000);
    else if (_Loading === false && _IsShowLoading) {
        Toast.hide()
        _IsShowLoading = false;
    }
}

export function showMessage(msg, onclose) {
    Toast.fail(msg, 2, onclose)
}

export function alert(msg) {
    Toast.fail(msg, 2)
}

export function alertTip(msg, title) {
    if (window.isModalInfo) return;
    window.isModalInfo = true;
    Modal.alert(title || "提示", msg, [{ text: '确认', onPress: () => window.isModalInfo = false }]
    );
}

export function alertSuccess(msg, onOk) {
    Toast.success(msg, 2, onOk)
}

export function confirm(msg, onOk) {
    Modal.alert('确认提示', msg, [{ text: '取消' }, { text: '确认', onPress: onOk }]);
}