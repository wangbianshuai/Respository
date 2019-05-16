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

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <LeftRightLayout {...this.props} />
      </LocaleProvider>
    )
  }
}
