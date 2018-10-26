import Page404 from "../../components/common/404";
import DvaIndex from "DavCommon";

const dva = new DvaIndex(Page404, window.InitialState);
dva.Init("/", "J_wrapBody");
