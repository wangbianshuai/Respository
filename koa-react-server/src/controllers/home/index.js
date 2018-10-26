import Index from "../../react-components/home/index";
import DvaIndex from "DavCommon";

const dva = new DvaIndex(Index, window.InitialState);
dva.Init("J_wrapBody");
