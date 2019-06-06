import React, { Component } from "react";
import LeftRightLayout from './LeftRightLayout/Index';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { EnvConfig } from "UtilsCommon";

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.Name = "Index";

    EnvConfig.SetEnv();
  }

  IsLogin() {
    const { location: { pathname } } = this.props;
    let name = pathname.toLowerCase().replace(".html", "");
    return name === '/login';
  }

  RenderPage() {
    if (this.IsLogin()) return this.props.children;

    return <LeftRightLayout {...this.props} />
  }

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        {this.RenderPage()}
      </LocaleProvider>
    )
  }
}
