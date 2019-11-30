import LeftRightLayout from './LeftRightLayout/Index';
import { EnvConfig } from "UtilsCommon";

EnvConfig.SetEnv();

function IsLogin(props) {
  const { location: { pathname } } = props;
  let name = pathname.toLowerCase().replace(".html", "");
  return name === '/login';
}

export default props => {
  if (IsLogin(props)) return props.children
  return <LeftRightLayout {...props} />
}
