import { message } from 'antd';
import router from 'umi/router';

let _Loading = false;
let _IsShowLoading = false;

export function setLoading(loading) {
  _Loading = loading;
  if (_Loading) setTimeout(() => {
    if (_Loading) {
      message.loading("加载中……", 0)
      _IsShowLoading = true;
    }
  }, 2000);
  else if (_Loading === false && _IsShowLoading) {
    message.destroy()
    _IsShowLoading = false;
  }
}

export function showMessage(msg) {
  message.warning(msg, 3)
}

export function toPage(url) {
  router.push(url)
}

export function toLogin() {
  toPage("/login")
}

export function isLoginPage() {
  const { location: { pathname } } = window;
  const ns = pathname.split('/');
  let name = ns[ns.length - 1].toLowerCase().replace(".html", "");
  return name === 'login';
}
