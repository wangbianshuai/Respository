import "./index.css";
import Index from "../../common/pages/home/index";
import DvaIndex from "../../common/dva/Index";

const dva = new DvaIndex(Index, window.InitialState);
dva.Init("/", "root");