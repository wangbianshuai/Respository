import { Component } from "react";
import { EnvConfig } from "UtilsCommon";

export default class Index extends Component {
  constructor(props) {
    super(props);

    EnvConfig.SetEnv();
  }

  render() {
    return this.props.children
  }
}
