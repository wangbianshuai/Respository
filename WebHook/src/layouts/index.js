import React, { Component } from "react";
import LeftRightLayout from './LeftRightLayout/Index';
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

  render() {
    return this.props.children;
  }

  render2() {
    if (this.IsLogin()) return this.props.children;

    return <LeftRightLayout {...this.props} />
  }
}
